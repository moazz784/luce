using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class EventDatePartsDto
{
    public string Day { get; set; } = string.Empty;
    public string Month { get; set; } = string.Empty;
}

public class EventPublicDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTimeOffset EventDate { get; set; }
    public EventDatePartsDto Date { get; set; } = new();
    public string? Location { get; set; }
    public string? TimeRange { get; set; }
    public string? Description { get; set; }
    public string? AccentColor { get; set; }
}

public class EventAdminDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTimeOffset EventDate { get; set; }
    public string? Location { get; set; }
    public string? TimeRange { get; set; }
    public string? Description { get; set; }
    public string? AccentColor { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class EventCreateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public DateTimeOffset EventDate { get; set; } = DateTimeOffset.UtcNow;

    [MaxLength(300)]
    public string? Location { get; set; }

    [MaxLength(200)]
    public string? TimeRange { get; set; }

    public string? Description { get; set; }

    [MaxLength(50)]
    public string? AccentColor { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}

public class EventUpdateDto
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public DateTimeOffset EventDate { get; set; }

    [MaxLength(300)]
    public string? Location { get; set; }

    [MaxLength(200)]
    public string? TimeRange { get; set; }

    public string? Description { get; set; }

    [MaxLength(50)]
    public string? AccentColor { get; set; }

    [Required]
    [MaxLength(2000)]
    public string ImageUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
