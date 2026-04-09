namespace Luce.Domain.Entities;

public class RegistrationOtp
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string OtpHash { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset? ConsumedAt { get; set; }
    public string PendingUserName { get; set; } = string.Empty;
}
