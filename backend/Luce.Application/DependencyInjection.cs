using Luce.Application.Abstractions.Services;
using Luce.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Luce.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IAwardService, AwardService>();
        services.AddScoped<IAlumniService, AlumniService>();
        services.AddScoped<IHeroService, HeroService>();
        services.AddScoped<ISyndicateService, SyndicateService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IHomeBundleService, HomeBundleService>();
        return services;
    }
}
