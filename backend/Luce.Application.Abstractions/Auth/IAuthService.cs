namespace Luce.Application.Abstractions.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> RegisterUserAsync(RegisterRequest request, CancellationToken cancellationToken = default);
}
