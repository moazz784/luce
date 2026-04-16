using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class NewsPublicDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string? Location { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTimeOffset? PublishedAt { get; set; }
}

public class NewsAdminDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Body { get; set; }
    public string? Location { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTimeOffset? PublishedAt { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class NewsCreateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public string? Body { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTimeOffset? PublishedAt { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}

public class NewsUpdateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public string? Body { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public DateTimeOffset? PublishedAt { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
