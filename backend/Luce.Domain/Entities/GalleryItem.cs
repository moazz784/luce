namespace Luce.Domain.Entities;

public class GalleryItem : EntityBase
{
    public int Year { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
