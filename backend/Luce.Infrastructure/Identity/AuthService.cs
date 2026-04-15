using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Luce.Application.Abstractions.Auth;
using Luce.Application.Abstractions.Persistence;
using Luce.Domain.Entities;
using Luce.Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Luce.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly RoleManager<IdentityRole> _roles;
    private readonly IJwtTokenService _jwt;
    private readonly AuthOptions _authOptions;
    private readonly IApplicationDbContext _db;
    private readonly IBrevoEmailService _email;
    private readonly OtpOptions _otpOptions;

    public AuthService(
        UserManager<ApplicationUser> users,
        RoleManager<IdentityRole> roles,
        IJwtTokenService jwt,
        IOptions<AuthOptions> authOptions,
        IApplicationDbContext db,
        IBrevoEmailService email,
        IOptions<OtpOptions> otpOptions)
    {
        _users = users;
        _roles = roles;
        _jwt = jwt;
        _authOptions = authOptions.Value;
        _db = db;
        _email = email;
        _otpOptions = otpOptions.Value;
    }

    private static bool IsMustLoginEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        return email.Trim().EndsWith("@must.edu.eg", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsStudentMustEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        return Regex.IsMatch(email.Trim(), @"^\d+@must\.edu\.eg$", RegexOptions.IgnoreCase);
    }

    private static string HashOtp(string otp, string emailNorm, string pepper)
    {
        var bytes = Encoding.UTF8.GetBytes($"{pepper}|{emailNorm}|{otp.Trim()}");
        return Convert.ToHexString(SHA256.HashData(bytes));
    }

    private static bool HexEqualsConstantTime(string a, string b)
    {
        if (a.Length != b.Length) return false;
        try
        {
            var ba = Convert.FromHexString(a);
            var bb = Convert.FromHexString(b);
            return CryptographicOperations.FixedTimeEquals(ba, bb);
        }
        catch
        {
            return false;
        }
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var raw = request.Login.Trim();
        if (string.IsNullOrEmpty(raw))
            throw new InvalidOperationException("Invalid username or password.");

        ApplicationUser? user;
        if (raw.Contains('@', StringComparison.Ordinal))
        {
            if (!IsMustLoginEmail(raw))
                throw new InvalidOperationException("Only @must.edu.eg accounts can sign in.");

            user = await _users.FindByEmailAsync(raw);
        }
        else
        {
            user = await _users.FindByNameAsync(raw);
            if (user is not null && (string.IsNullOrWhiteSpace(user.Email) || !IsMustLoginEmail(user.Email)))
                user = null;
        }

        if (user is null)
            throw new InvalidOperationException("Invalid username or password.");

        var valid = await _users.CheckPasswordAsync(user, request.Password);
        if (!valid)
            throw new InvalidOperationException("Invalid username or password.");

        var roleNames = await _users.GetRolesAsync(user);
        var emailClaim = user.Email ?? raw;
        return _jwt.CreateToken(user.Id, emailClaim, user.UserName ?? emailClaim, roleNames.ToList());
    }

    public Task<AuthResponse?> RegisterUserAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException(
            "Use the registration verification flow: POST /api/auth/register/start then POST /api/auth/register/verify.");
    }

    public async Task StartRegistrationAsync(RegisterStartRequest request, CancellationToken cancellationToken = default)
    {
        if (!_authOptions.AllowRegister)
            throw new InvalidOperationException("Registration is disabled.");

        var email = request.Email.Trim();
        if (!IsStudentMustEmail(email))
            throw new InvalidOperationException("Student registration requires a numeric ID email (e.g. 12345@must.edu.eg).");

        if (await _users.FindByEmailAsync(email) is not null)
            throw new InvalidOperationException("Email is already registered.");

        var existing = await _db.RegistrationOtps
            .Where(x => x.Email == email && x.ConsumedAt == null)
            .ToListAsync(cancellationToken);
        _db.RegistrationOtps.RemoveRange(existing);

        var otp = RandomNumberGenerator.GetInt32(100000, 1000000).ToString("D6");
        var emailNorm = email.ToLowerInvariant();
        var hash = HashOtp(otp, emailNorm, _otpOptions.Pepper);
        var now = DateTimeOffset.UtcNow;
        var expires = now.AddMinutes(_otpOptions.ExpiryMinutes <= 0 ? 15 : _otpOptions.ExpiryMinutes);

        _db.RegistrationOtps.Add(new RegistrationOtp
        {
            Email = email,
            OtpHash = hash,
            CreatedAt = now,
            ExpiresAt = expires,
            PendingUserName = request.UserName.Trim(),
        });
        await _db.SaveChangesAsync(cancellationToken);

        await _email.SendOtpAsync(email, otp, cancellationToken);
    }

    public async Task<AuthResponse> CompleteRegistrationAsync(RegisterVerifyRequest request, CancellationToken cancellationToken = default)
    {
        if (!_authOptions.AllowRegister)
            throw new InvalidOperationException("Registration is disabled.");

        var email = request.Email.Trim();
        if (!IsStudentMustEmail(email))
            throw new InvalidOperationException("Invalid email for student registration.");

        if (await _users.FindByEmailAsync(email) is not null)
            throw new InvalidOperationException("Email is already registered.");

        var row = await _db.RegistrationOtps
            .Where(x => x.Email == email && x.ConsumedAt == null && x.ExpiresAt > DateTimeOffset.UtcNow)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        if (row is null)
            throw new InvalidOperationException("No pending verification for this email or the code expired. Request a new code.");

        var emailNorm = email.ToLowerInvariant();
        var hash = HashOtp(request.Otp, emailNorm, _otpOptions.Pepper);
        if (!HexEqualsConstantTime(hash, row.OtpHash))
            throw new InvalidOperationException("Invalid verification code.");

        var user = new ApplicationUser
        {
            UserName = row.PendingUserName,
            Email = email,
            EmailConfirmed = true,
        };

        var createResult = await _users.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
            throw new InvalidOperationException(string.Join("; ", createResult.Errors.Select(e => e.Description)));

        row.ConsumedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);

        const string userRole = "User";
        if (!await _roles.RoleExistsAsync(userRole))
            await _roles.CreateAsync(new IdentityRole(userRole));

        await _users.AddToRoleAsync(user, userRole);

        var roles = await _users.GetRolesAsync(user);
        return _jwt.CreateToken(user.Id, user.Email ?? email, user.UserName ?? email, roles.ToList());
    }
}
