namespace Luce.Domain.Entities;

public class NewsItem : EntityBase
{
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTimeOffset? PublishedAt { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
