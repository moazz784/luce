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
        NormalizeGalleryPayload(dto.ImageUrl, dto.VideoUrl, dto.MediaType, out var imageUrl, out var videoUrl, out var mediaType);

        var now = DateTimeOffset.UtcNow;
        var entity = new GalleryItem
        {
            Year = dto.Year,
            ImageUrl = imageUrl,
            VideoUrl = videoUrl,
            MediaType = mediaType,
            MediaTitle = NormalizeMediaTitle(dto.MediaTitle),
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

        NormalizeGalleryPayload(dto.ImageUrl, dto.VideoUrl, dto.MediaType, out var imageUrl, out var videoUrl, out var mediaType);

        entity.Year = dto.Year;
        entity.ImageUrl = imageUrl;
        entity.VideoUrl = videoUrl;
        entity.MediaType = mediaType;
        entity.MediaTitle = NormalizeMediaTitle(dto.MediaTitle);
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

    private static void NormalizeGalleryPayload(
        string? imageUrlRaw,
        string? videoUrlRaw,
        string? mediaTypeRaw,
        out string imageUrl,
        out string? videoUrl,
        out string mediaType)
    {
        var mode = (mediaTypeRaw ?? "image").Trim().ToLowerInvariant();
        if (mode != "image" && mode != "video")
            throw new ArgumentException("نوع الوسائط غير صالح.");

        var img = imageUrlRaw?.Trim() ?? "";
        var vid = string.IsNullOrWhiteSpace(videoUrlRaw) ? null : videoUrlRaw.Trim();

        if (mode == "image")
        {
            if (string.IsNullOrEmpty(img))
                throw new ArgumentException("يرجى رفع صورة أو إدخال رابط صورة.");
            imageUrl = img;
            videoUrl = null;
            mediaType = "image";
        }
        else
        {
            if (string.IsNullOrEmpty(vid))
                throw new ArgumentException("يرجى إدخال رابط الفيديو.");
            imageUrl = "";
            videoUrl = vid;
            mediaType = "video";
        }
    }

    private static string NormalizeMediaTitle(string? raw) => raw?.Trim() ?? string.Empty;
}
