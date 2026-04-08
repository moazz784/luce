using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class EventService : IEventService
{
    private readonly IApplicationDbContext _db;

    public EventService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<EventPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.Events
            .AsNoTracking()
            .OrderBy(e => e.SortOrder)
            .ThenByDescending(e => e.EventDate)
            .ToListAsync(cancellationToken);
        return items.Select(e => e.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<EventAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.Events
            .AsNoTracking()
            .OrderBy(e => e.SortOrder)
            .ThenByDescending(e => e.EventDate)
            .ToListAsync(cancellationToken);
        return list.Select(e => e.ToAdminDto()).ToList();
    }

    public async Task<EventAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.Events.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<EventAdminDto> CreateAsync(EventCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new EventItem
        {
            Title = dto.Title,
            EventDate = dto.EventDate,
            Location = dto.Location,
            TimeRange = dto.TimeRange,
            Description = dto.Description,
            AccentColor = dto.AccentColor,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.Events.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<EventAdminDto?> UpdateAsync(int id, EventUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Events.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.EventDate = dto.EventDate;
        entity.Location = dto.Location;
        entity.TimeRange = dto.TimeRange;
        entity.Description = dto.Description;
        entity.AccentColor = dto.AccentColor;
        entity.ImageUrl = dto.ImageUrl;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Events.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.Events.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
