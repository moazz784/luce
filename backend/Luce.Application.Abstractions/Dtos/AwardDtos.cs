using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class AwardPublicDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? WinnerName { get; set; }
    public string? Content { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class AwardAdminDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? WinnerName { get; set; }
    public string? Content { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class AwardCreateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Subtitle { get; set; }

    [MaxLength(300)]
    public string? WinnerName { get; set; }

    public string? Content { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

public class AwardUpdateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Subtitle { get; set; }

    [MaxLength(300)]
    public string? WinnerName { get; set; }

    public string? Content { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
