namespace Luce.Application.Abstractions.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> RegisterAdminAsync(RegisterRequest request, CancellationToken cancellationToken = default);
}
