using System.ComponentModel.DataAnnotations;

namespace Luce.Application.Abstractions.Dtos;

public class ContactCreateDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Phone { get; set; }

    [Required]
    [MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
}

public class HomeBundleDto
{
    public IReadOnlyList<NewsPublicDto> News { get; set; } = Array.Empty<NewsPublicDto>();
    public IReadOnlyList<EventPublicDto> Events { get; set; } = Array.Empty<EventPublicDto>();
    public IReadOnlyList<AwardPublicDto> Awards { get; set; } = Array.Empty<AwardPublicDto>();
    public IReadOnlyList<AlumniPublicDto> Alumni { get; set; } = Array.Empty<AlumniPublicDto>();
    public IReadOnlyList<HeroSlidePublicDto> HeroSlides { get; set; } = Array.Empty<HeroSlidePublicDto>();
    public IReadOnlyList<SyndicatePublicDto> Syndicates { get; set; } = Array.Empty<SyndicatePublicDto>();
}
