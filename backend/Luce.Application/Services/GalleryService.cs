using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class GalleryService : IGalleryService
{
    private readonly IApplicationDbContext _db;

    public GalleryService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<GalleryPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.GalleryItems
            .AsNoTracking()
            .OrderByDescending(g => g.Year)
            .ThenBy(g => g.SortOrder)
            .ThenBy(g => g.Id)
            .ToListAsync(cancellationToken);
        return items.Select(g => g.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<GalleryAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.GalleryItems
            .AsNoTracking()
            .OrderByDescending(g => g.Year)
            .ThenBy(g => g.SortOrder)
            .ThenBy(g => g.Id)
            .ToListAsync(cancellationToken);
        return list.Select(g => g.ToAdminDto()).ToList();
    }

    public async Task<GalleryAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.GalleryItems.AsNoTracking().FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<GalleryAdminDto> CreateAsync(GalleryCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new GalleryItem
        {
            Year = dto.Year,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.GalleryItems.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<GalleryAdminDto?> UpdateAsync(int id, GalleryUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.GalleryItems.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Year = dto.Year;
        entity.ImageUrl = dto.ImageUrl;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.GalleryItems.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.GalleryItems.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
