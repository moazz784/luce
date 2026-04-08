namespace Luce.Domain.Entities;

public class EventItem : EntityBase
{
    public string Title { get; set; } = string.Empty;
    public DateTimeOffset EventDate { get; set; }
    public string? Location { get; set; }
    public string? TimeRange { get; set; }
    public string? Description { get; set; }
    public string? AccentColor { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
