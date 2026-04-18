using Luce.Application.Abstractions.Persistence;
using Luce.Domain.Entities;
using Luce.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Luce.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<NewsItem> NewsItems => Set<NewsItem>();
    public DbSet<EventItem> Events => Set<EventItem>();
    public DbSet<AwardItem> Awards => Set<AwardItem>();
    public DbSet<AlumniItem> Alumni => Set<AlumniItem>();
    public DbSet<HeroSlide> HeroSlides => Set<HeroSlide>();
    public DbSet<SyndicateCard> SyndicateCards => Set<SyndicateCard>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<RegistrationOtp> RegistrationOtps => Set<RegistrationOtp>();
    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<NewsItem>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
            e.Property(x => x.Location).HasMaxLength(300);
        });

        builder.Entity<EventItem>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
            e.Property(x => x.Location).HasMaxLength(300);
            e.Property(x => x.TimeRange).HasMaxLength(200);
            e.Property(x => x.AccentColor).HasMaxLength(50);
        });

        builder.Entity<AwardItem>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
            e.Property(x => x.Subtitle).HasMaxLength(300);
            e.Property(x => x.WinnerName).HasMaxLength(300);
        });

        builder.Entity<AlumniItem>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(300);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
        });

        builder.Entity<HeroSlide>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(500);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
        });

        builder.Entity<SyndicateCard>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(300);
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
            e.Property(x => x.Link).HasMaxLength(2000);
            e.Property(x => x.ButtonText).HasMaxLength(200);
        });

        builder.Entity<ContactMessage>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.Phone).HasMaxLength(50);
            e.Property(x => x.Message).HasMaxLength(4000);
        });

        builder.Entity<RegistrationOtp>(e =>
        {
            e.HasIndex(x => x.Email);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.OtpHash).HasMaxLength(128);
            e.Property(x => x.PendingUserName).HasMaxLength(256);
        });

        builder.Entity<GalleryItem>(e =>
        {
            e.Property(x => x.ImageUrl).HasMaxLength(2000);
            e.Property(x => x.VideoUrl).HasMaxLength(2000);
            e.Property(x => x.MediaType).HasMaxLength(32);
        });
    }
}
