using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/public")]
[AllowAnonymous]
public class PublicController : ControllerBase
{
    private readonly IHomeBundleService _homeBundle;
    private readonly INewsService _news;
    private readonly IEventService _events;
    private readonly IAwardService _awards;
    private readonly IAlumniService _alumni;
    private readonly IHeroService _hero;
    private readonly ISyndicateService _syndicates;
    private readonly IContactService _contact;

    public PublicController(
        IHomeBundleService homeBundle,
        INewsService news,
        IEventService events,
        IAwardService awards,
        IAlumniService alumni,
        IHeroService hero,
        ISyndicateService syndicates,
        IContactService contact)
    {
        _homeBundle = homeBundle;
        _news = news;
        _events = events;
        _awards = awards;
        _alumni = alumni;
        _hero = hero;
        _syndicates = syndicates;
        _contact = contact;
    }

    [HttpGet("home-bundle")]
    public async Task<ActionResult<HomeBundleDto>> GetHomeBundle(CancellationToken cancellationToken)
    {
        var bundle = await _homeBundle.GetAsync(cancellationToken);
        return Ok(bundle);
    }

    [HttpGet("news")]
    public async Task<ActionResult<IReadOnlyList<NewsPublicDto>>> GetNews(CancellationToken cancellationToken)
    {
        var list = await _news.GetPublishedAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("events")]
    public async Task<ActionResult<IReadOnlyList<EventPublicDto>>> GetEvents(CancellationToken cancellationToken)
    {
        var list = await _events.GetPublicAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("awards")]
    public async Task<ActionResult<IReadOnlyList<AwardPublicDto>>> GetAwards(CancellationToken cancellationToken)
    {
        var list = await _awards.GetPublicAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("alumni")]
    public async Task<ActionResult<IReadOnlyList<AlumniPublicDto>>> GetAlumni(CancellationToken cancellationToken)
    {
        var list = await _alumni.GetPublicAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("hero")]
    public async Task<ActionResult<IReadOnlyList<HeroSlidePublicDto>>> GetHero(CancellationToken cancellationToken)
    {
        var list = await _hero.GetPublicAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("syndicates")]
    public async Task<ActionResult<IReadOnlyList<SyndicatePublicDto>>> GetSyndicates(CancellationToken cancellationToken)
    {
        var list = await _syndicates.GetPublicAsync(cancellationToken);
        return Ok(list);
    }

    [HttpPost("contact")]
    public async Task<ActionResult> PostContact([FromBody] ContactCreateDto dto, CancellationToken cancellationToken)
    {
        var id = await _contact.SubmitAsync(dto, cancellationToken);
        return Ok(new { id });
    }
}
