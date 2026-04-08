namespace Luce.Application.Abstractions.Auth;

public interface IJwtTokenService
{
    AuthResponse CreateToken(string userId, string email, string userName, IReadOnlyList<string> roles);
}
