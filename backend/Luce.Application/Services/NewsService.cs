using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Persistence;
using Luce.Application.Abstractions.Services;
using Luce.Application.Mapping;
using Luce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Luce.Application.Services;

public class NewsService : INewsService
{
    private readonly IApplicationDbContext _db;

    public NewsService(IApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<NewsPublicDto>> GetPublishedAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.NewsItems
            .AsNoTracking()
            .Where(n => n.IsPublished)
            .OrderBy(n => n.SortOrder)
            .ThenByDescending(n => n.PublishedAt ?? n.CreatedAt)
            .ToListAsync(cancellationToken);
        return list.Select(n => n.ToPublicDto()).ToList();
    }

    public async Task<IReadOnlyList<NewsAdminDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var list = await _db.NewsItems
            .AsNoTracking()
            .OrderBy(n => n.SortOrder)
            .ThenByDescending(n => n.Id)
            .ToListAsync(cancellationToken);
        return list.Select(n => n.ToAdminDto()).ToList();
    }

    public async Task<NewsAdminDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var e = await _db.NewsItems.AsNoTracking().FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
        return e?.ToAdminDto();
    }

    public async Task<NewsAdminDto> CreateAsync(NewsCreateDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new NewsItem
        {
            Title = dto.Title,
            Body = dto.Body,
            ImageUrl = dto.ImageUrl,
            PublishedAt = dto.PublishedAt,
            SortOrder = dto.SortOrder,
            IsPublished = dto.IsPublished,
            CreatedAt = now
        };
        _db.NewsItems.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<NewsAdminDto?> UpdateAsync(int id, NewsUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var entity = await _db.NewsItems.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
        if (entity is null) return null;

        entity.Title = dto.Title;
        entity.Body = dto.Body;
        entity.ImageUrl = dto.ImageUrl;
        entity.PublishedAt = dto.PublishedAt;
        entity.SortOrder = dto.SortOrder;
        entity.IsPublished = dto.IsPublished;
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return entity.ToAdminDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.NewsItems.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
        if (entity is null) return false;
        _db.NewsItems.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
