using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class HeroService : IHeroService
{
    private readonly IApplicationDbContext _db;

    public HeroService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<HeroSlidePublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.HeroSlides
            .AsNoTracking()
            .OrderBy(h => h.SortOrder)
            .ThenBy(h => h.Id)
            .ToListAsync(cancellationToken);
        return items.Select(h => h.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<HeroSlideAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.HeroSlides
            .AsNoTracking()
            .OrderBy(h => h.SortOrder)
            .ThenBy(h => h.Id)
            .ToListAsync(cancellationToken);
        return list.Select(h => h.ToAdminDto()).ToList();
    }

    public async Task<HeroSlideAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.HeroSlides.AsNoTracking().FirstOrDefaultAsync(h => h.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<HeroSlideAdminDto> CreateAsync(HeroSlideCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new HeroSlide
        {
            Title = dto.Title,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.HeroSlides.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<HeroSlideAdminDto?> UpdateAsync(int id, HeroSlideUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.HeroSlides.FirstOrDefaultAsync(h => h.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.ImageUrl = dto.ImageUrl;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.HeroSlides.FirstOrDefaultAsync(h => h.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.HeroSlides.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
