using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class GalleryPublicDto
{
    public int Id { get; set; }
    public int Year { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string MediaType { get; set; } = "image";
    public int SortOrder { get; set; }
}

public class GalleryAdminDto
{
    public int Id { get; set; }
    public int Year { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? VideoUrl { get; set; }
    public string MediaType { get; set; } = "image";
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class GalleryCreateDto
{
    [Range(1900, 3000)]
    public int Year { get; set; }

    [MaxLength(2000)]
    public string? ImageUrl { get; set; }

    [MaxLength(2000)]
    public string? VideoUrl { get; set; }

    [MaxLength(32)]
    public string MediaType { get; set; } = "image";

    public int SortOrder { get; set; }
}

public class GalleryUpdateDto
{
    [Range(1900, 3000)]
    public int Year { get; set; }

    [MaxLength(2000)]
    public string? ImageUrl { get; set; }

    [MaxLength(2000)]
    public string? VideoUrl { get; set; }

    [MaxLength(32)]
    public string MediaType { get; set; } = "image";

    public int SortOrder { get; set; }
}
