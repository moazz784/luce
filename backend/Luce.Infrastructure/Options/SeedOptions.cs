namespace Luce.Infrastructure.Options;

public class SeedOptions
{
    public const string SectionName = "Seed";

    public string AdminEmail { get; set; } = "admin@localhost";
    public string AdminPassword { get; set; } = "ChangeMe!123";
}
