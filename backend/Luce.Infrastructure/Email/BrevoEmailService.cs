using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Luce.Application.Abstractions.Auth;
using Luce.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace Luce.Infrastructure.Email;

public class BrevoEmailService : IBrevoEmailService
{
    private readonly HttpClient _http;
    private readonly BrevoOptions _opts;
    private readonly int _expiryMinutes;

    public BrevoEmailService(
        HttpClient http,
        IOptions<BrevoOptions> brevoOptions,
        IOptions<OtpOptions> otpOptions)
    {
        _http = http;
        _opts = brevoOptions.Value;
        _expiryMinutes = otpOptions.Value.ExpiryMinutes > 0 ? otpOptions.Value.ExpiryMinutes : 15;
    }

    public async Task SendOtpAsync(string toEmail, string otpCode, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_opts.ApiKey))
            throw new InvalidOperationException("Brevo API key is not configured (Brevo:ApiKey).");

        if (string.IsNullOrWhiteSpace(_opts.SenderEmail))
            throw new InvalidOperationException("Brevo sender email is not configured (Brevo:SenderEmail).");

        var body = new
        {
            sender = new { name = _opts.SenderName, email = _opts.SenderEmail },
            to = new[] { new { email = toEmail } },
            subject = "MUST — your verification code",
            htmlContent =
                $"<p>Your verification code is: <strong style=\"font-size:1.25em\">{System.Net.WebUtility.HtmlEncode(otpCode ?? "")}</strong></p>" +
                $"<p>This code expires in {_expiryMinutes} minutes.</p>",
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.TryAddWithoutValidation("api-key", _opts.ApiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
        request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        var response = await _http.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"Email send failed: {(int)response.StatusCode} {err}");
        }
    }
}
