using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class AwardService : IAwardService
{
    private readonly IApplicationDbContext _db;

    public AwardService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<AwardPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.Awards
            .AsNoTracking()
            .OrderBy(a => a.SortOrder)
            .ThenBy(a => a.Id)
            .ToListAsync(cancellationToken);
        return items.Select(a => a.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<AwardAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.Awards
            .AsNoTracking()
            .OrderBy(a => a.SortOrder)
            .ThenByDescending(a => a.Id)
            .ToListAsync(cancellationToken);
        return list.Select(a => a.ToAdminDto()).ToList();
    }

    public async Task<AwardAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.Awards.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<AwardAdminDto> CreateAsync(AwardCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new AwardItem
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            WinnerName = dto.WinnerName,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.Awards.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<AwardAdminDto?> UpdateAsync(int id, AwardUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Awards.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Subtitle = dto.Subtitle;
        entity.WinnerName = dto.WinnerName;
        entity.Content = dto.Content;
        entity.ImageUrl = dto.ImageUrl;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Awards.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.Awards.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
