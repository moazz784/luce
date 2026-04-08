namespace Luce.Domain.Entities;

public class AwardItem : EntityBase
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? WinnerName { get; set; }
    public string? Content { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
