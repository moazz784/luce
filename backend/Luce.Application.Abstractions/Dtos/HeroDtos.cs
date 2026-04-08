using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class HeroSlidePublicDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class HeroSlideAdminDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class HeroSlideCreateDto
{
    [MaxLength(500)]
    public string? Title { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

public class HeroSlideUpdateDto
{
    [MaxLength(500)]
    public string? Title { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
