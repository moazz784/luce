using Luce.Application.Abstractions.Auth;
using Luce.Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Luce.Infrastructure.Identity;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly RoleManager<IdentityRole> _roles;
    private readonly IJwtTokenService _jwt;
    private readonly AuthOptions _authOptions;

    public AuthService(
        UserManager<ApplicationUser> users,
        RoleManager<IdentityRole> roles,
        IJwtTokenService jwt,
        IOptions<AuthOptions> authOptions)
    {
        _users = users;
        _roles = roles;
        _jwt = jwt;
        _authOptions = authOptions.Value;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _users.FindByEmailAsync(request.Email);
        if (user is null)
            throw new InvalidOperationException("Invalid email or password.");

        var valid = await _users.CheckPasswordAsync(user, request.Password);
        if (!valid)
            throw new InvalidOperationException("Invalid email or password.");

        var roleNames = await _users.GetRolesAsync(user);
        return _jwt.CreateToken(user.Id, user.Email ?? request.Email, user.UserName ?? user.Email ?? request.Email, roleNames.ToList());
    }

    public async Task<AuthResponse?> RegisterAdminAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (!_authOptions.AllowRegister)
            return null;

        if (await _users.FindByEmailAsync(request.Email) is not null)
            throw new InvalidOperationException("Email is already registered.");

        var user = new ApplicationUser
        {
            UserName = request.UserName,
            Email = request.Email,
            EmailConfirmed = true
        };

        var result = await _users.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));

        const string adminRole = "Admin";
        if (!await _roles.RoleExistsAsync(adminRole))
            await _roles.CreateAsync(new IdentityRole(adminRole));

        await _users.AddToRoleAsync(user, adminRole);

        var roles = await _users.GetRolesAsync(user);
        return _jwt.CreateToken(user.Id, user.Email ?? request.Email, user.UserName ?? request.Email, roles.ToList());
    }
}
