namespace Luce.Domain.Entities;

public class SyndicateCard : EntityBase
{
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
