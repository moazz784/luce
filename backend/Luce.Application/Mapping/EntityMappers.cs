using System.Globalization;
using Luce.Application.Abstractions.Dtos;
using Luce.Domain.Entities;

namespace Luce.Application.Mapping;

public static class EntityMappers
{
    public static NewsPublicDto ToPublicDto(this NewsItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Body = e.Body,
        Location = e.Location,
        ImageUrl = e.ImageUrl,
        PublishedAt = e.PublishedAt
    };

    public static NewsAdminDto ToAdminDto(this NewsItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Body = e.Body,
        Location = e.Location,
        ImageUrl = e.ImageUrl,
        PublishedAt = e.PublishedAt,
        SortOrder = e.SortOrder,
        IsPublished = e.IsPublished,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static EventDatePartsDto ToDateParts(DateTimeOffset eventDate)
    {
        var d = eventDate.DateTime;
        return new EventDatePartsDto
        {
            Day = d.Day.ToString("00", CultureInfo.InvariantCulture),
            Month = d.ToString("MMM", CultureInfo.InvariantCulture)
        };
    }

    public static EventPublicDto ToPublicDto(this EventItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        ImageUrl = e.ImageUrl,
        EventDate = e.EventDate,
        Date = ToDateParts(e.EventDate),
        Location = e.Location,
        TimeRange = e.TimeRange,
        Description = e.Description,
        AccentColor = e.AccentColor
    };

    public static EventAdminDto ToAdminDto(this EventItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        EventDate = e.EventDate,
        Location = e.Location,
        TimeRange = e.TimeRange,
        Description = e.Description,
        AccentColor = e.AccentColor,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static AwardPublicDto ToPublicDto(this AwardItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Subtitle = e.Subtitle,
        WinnerName = e.WinnerName,
        Content = e.Content,
        ImageUrl = e.ImageUrl
    };

    public static AwardAdminDto ToAdminDto(this AwardItem e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Subtitle = e.Subtitle,
        WinnerName = e.WinnerName,
        Content = e.Content,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static AlumniPublicDto ToPublicDto(this AlumniItem e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        ShortDescription = e.ShortDescription,
        FullBio = e.FullBio,
        ImageUrl = e.ImageUrl
    };

    public static AlumniAdminDto ToAdminDto(this AlumniItem e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        ShortDescription = e.ShortDescription,
        FullBio = e.FullBio,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static HeroSlidePublicDto ToPublicDto(this HeroSlide e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        ImageUrl = e.ImageUrl
    };

    public static HeroSlideAdminDto ToAdminDto(this HeroSlide e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static SyndicatePublicDto ToPublicDto(this SyndicateCard e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        ImageUrl = e.ImageUrl,
        Link = e.Link,
        ButtonText = e.ButtonText
    };

    public static SyndicateAdminDto ToAdminDto(this SyndicateCard e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        ImageUrl = e.ImageUrl,
        Link = e.Link,
        ButtonText = e.ButtonText,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };

    public static GalleryPublicDto ToPublicDto(this GalleryItem e) => new()
    {
        Id = e.Id,
        Year = e.Year,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder
    };

    public static GalleryAdminDto ToAdminDto(this GalleryItem e) => new()
    {
        Id = e.Id,
        Year = e.Year,
        ImageUrl = e.ImageUrl,
        SortOrder = e.SortOrder,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    };
}
