using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class SyndicatePublicDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
}

public class SyndicateAdminDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class SyndicateCreateDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Link { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ButtonText { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

public class SyndicateUpdateDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Link { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ButtonText { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
