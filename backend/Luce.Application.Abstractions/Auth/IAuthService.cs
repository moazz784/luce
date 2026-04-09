namespace Luce.Application.Abstractions.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> RegisterUserAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    /// <summary>Send OTP to student email; does not create the user yet.</summary>
    Task StartRegistrationAsync(RegisterStartRequest request, CancellationToken cancellationToken = default);

    /// <summary>Verify OTP and create the user account.</summary>
    Task<AuthResponse> CompleteRegistrationAsync(RegisterVerifyRequest request, CancellationToken cancellationToken = default);
}
