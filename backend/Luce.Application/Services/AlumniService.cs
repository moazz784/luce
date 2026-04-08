using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class AlumniService : IAlumniService
{
    private readonly IApplicationDbContext _db;

    public AlumniService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<AlumniPublicDto>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var items = await _db.Alumni
            .AsNoTracking()
            .OrderBy(a => a.SortOrder)
            .ThenBy(a => a.Id)
            .ToListAsync(cancellationToken);
        return items.Select(a => a.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<AlumniAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.Alumni
            .AsNoTracking()
            .OrderBy(a => a.SortOrder)
            .ThenByDescending(a => a.Id)
            .ToListAsync(cancellationToken);
        return list.Select(a => a.ToAdminDto()).ToList();
    }

    public async Task<AlumniAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.Alumni.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<AlumniAdminDto> CreateAsync(AlumniCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new AlumniItem
        {
            Name = dto.Name,
            ShortDescription = dto.ShortDescription,
            FullBio = dto.FullBio,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            CreatedAt = now
        };
        _db.Alumni.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<AlumniAdminDto?> UpdateAsync(int id, AlumniUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Alumni.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Name = dto.Name;
        entity.ShortDescription = dto.ShortDescription;
        entity.FullBio = dto.FullBio;
        entity.ImageUrl = dto.ImageUrl;
        entity.SortOrder = dto.SortOrder;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Alumni.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.Alumni.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
