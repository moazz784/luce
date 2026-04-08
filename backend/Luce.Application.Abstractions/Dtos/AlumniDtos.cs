using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class AlumniPublicDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? FullBio { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class AlumniAdminDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? FullBio { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class AlumniCreateDto
{
    [Required]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    public string? ShortDescription { get; set; }
    public string? FullBio { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

public class AlumniUpdateDto
{
    [Required]
    [MaxLength(300)]
    public string Name { get; set; } = string.Empty;

    public string? ShortDescription { get; set; }
    public string? FullBio { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
