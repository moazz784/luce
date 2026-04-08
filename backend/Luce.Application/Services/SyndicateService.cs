using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class SyndicateService : ISyndicateService
{
    private readonly IApplicationDbContext _db;

    public SyndicateService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<SyndicatePublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.SyndicateCards
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .ThenBy(s => s.Id)
            .ToListAsync(cancellationToken);
        return items.Select(s => s.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<SyndicateAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.SyndicateCards
            .AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .ThenByDescending(s => s.Id)
            .ToListAsync(cancellationToken);
        return list.Select(s => s.ToAdminDto()).ToList();
    }

    public async Task<SyndicateAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.SyndicateCards.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<SyndicateAdminDto> CreateAsync(SyndicateCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new SyndicateCard
        {
            Title = dto.Title,
            ImageUrl = dto.ImageUrl,
            Link = dto.Link,
            ButtonText = dto.ButtonText,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.SyndicateCards.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<SyndicateAdminDto?> UpdateAsync(int id, SyndicateUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.SyndicateCards.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.ImageUrl = dto.ImageUrl;
        entity.Link = dto.Link;
        entity.ButtonText = dto.ButtonText;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.SyndicateCards.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.SyndicateCards.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
