using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;

namespace Luce.Application.Services;

public class HomeBundleService : IHomeBundleService
{
    private readonly INewsService _news;
    private readonly IEventService _events;
    private readonly IAwardService _awards;
    private readonly IAlumniService _alumni;
    private readonly IHeroService _hero;
    private readonly ISyndicateService _syndicates;

    public HomeBundleService(
        INewsService news,
        IEventService events,
        IAwardService awards,
        IAlumniService alumni,
        IHeroService hero,
        ISyndicateService syndicates)
    {
        _news = news;
        _events = events;
        _awards = awards;
        _alumni = alumni;
        _hero = hero;
        _syndicates = syndicates;
    }

    public async Task<HomeBundleDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var news = await _news.GetPublishedAsync(cancellationToken);
        var events = await _events.GetPublicAsync(cancellationToken);
        var awards = await _awards.GetPublicAsync(cancellationToken);
        var alumni = await _alumni.GetPublicAsync(cancellationToken);
        var hero = await _hero.GetPublicAsync(cancellationToken);
        var syndicates = await _syndicates.GetPublicAsync(cancellationToken);

        return new HomeBundleDto
        {
            News = news,
            Events = events,
            Awards = awards,
            Alumni = alumni,
            HeroSlides = hero,
            Syndicates = syndicates
        };
    }
}
