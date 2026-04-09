namespace Luce.Infrastructure.Options;

public class OtpOptions
{
    public const string SectionName = "Otp";

    /// <summary>Secret mixed into OTP hashing (set in production).</summary>
    public string Pepper { get; set; } = "CHANGE_ME_OTP_PEPPER";

    public int ExpiryMinutes { get; set; } = 15;
}
