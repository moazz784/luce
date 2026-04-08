namespace Luce.Domain.Entities;

public class AlumniItem : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? FullBio { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
