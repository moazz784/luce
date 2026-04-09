namespace Luce.Application.Abstractions.Auth;

public interface IBrevoEmailService
{
    Task SendOtpAsync(string toEmail, string otpCode, CancellationToken cancellationToken = default);
}
