namespace Luce.Domain.Entities;

public class HeroSlide : EntityBase
{
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
