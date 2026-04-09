using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Abstractions.Persistence;

public interface IApplicationDbContext
{
    DbSet<NewsItem> NewsItems { get; }
    DbSet<EventItem> Events { get; }
    DbSet<AwardItem> Awards { get; }
    DbSet<AlumniItem> Alumni { get; }
    DbSet<HeroSlide> HeroSlides { get; }
    DbSet<SyndicateCard> SyndicateCards { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<RegistrationOtp> RegistrationOtps { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
