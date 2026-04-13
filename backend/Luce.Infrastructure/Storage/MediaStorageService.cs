using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Storage;
using Microsoft.AspNetCore.Hosting;

namespace Luce.Infrastructure.Storage;

public class MediaStorageService : IMediaStorageService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"
    };

    /// <summary>Images and other uploads except PDF.</summary>
    private const long MaxBytesDefault = 5 * 1024 * 1024;

    /// <summary>PDF documents (ESSP links etc.) can be slightly larger.</summary>
    private const long MaxBytesPdf = 10 * 1024 * 1024;

    private readonly IWebHostEnvironment _env;

    public MediaStorageService(IWebHostEnvironment env) => _env = env;

    public async Task<MediaUploadResultDto> SaveAsync(Stream stream, string originalFileName, string contentType, CancellationToken cancellationToken = default)
    {
        var ext = Path.GetExtension(originalFileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new InvalidOperationException("Unsupported file type.");

        var maxForFile = string.Equals(ext, ".pdf", StringComparison.OrdinalIgnoreCase)
            ? MaxBytesPdf
            : MaxBytesDefault;

        if (stream.CanSeek)
        {
            if (stream.Length > maxForFile)
                throw new InvalidOperationException("File is too large.");
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploads = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploads);

        var fileName = $"{Guid.NewGuid():N}{ext}";
        var physicalPath = Path.Combine(uploads, fileName);

        await using (var fs = File.Create(physicalPath))
        {
            await stream.CopyToAsync(fs, cancellationToken);
        }

        var relative = $"/uploads/{fileName}";
        return new MediaUploadResultDto { Url = relative };
    }
}
