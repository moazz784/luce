using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Luce.Application.Abstractions.Auth;
using Luce.Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Luce.Infrastructure.Identity;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions _options;

    public JwtTokenService(IOptions<JwtOptions> options) => _options = options.Value;

    public AuthResponse CreateToken(string userId, string email, string userName, IReadOnlyList<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email),
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, userName),
            new(ClaimTypes.Email, email)
        };

        foreach (var role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        var expires = DateTimeOffset.UtcNow.AddMinutes(_options.AccessTokenMinutes);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expires.UtcDateTime,
            signingCredentials: creds);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.WriteToken(token);

        return new AuthResponse
        {
            AccessToken = jwt,
            ExpiresAt = expires,
            Email = email,
            UserName = userName,
            Roles = roles.ToList()
        };
    }
}
