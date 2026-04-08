using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Storage;
using Microsoft.AspNetCore.Hosting;

namespace Luce.Infrastructure.Storage;

public class MediaStorageService : IMediaStorageService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    };

    private const long MaxBytes = 5 * 1024 * 1024;

    private readonly IWebHostEnvironment _env;

    public MediaStorageService(IWebHostEnvironment env) => _env = env;

    public async Task<MediaUploadResultDto> SaveAsync(Stream stream, string originalFileName, string contentType, CancellationToken cancellationToken = default)
    {
        var ext = Path.GetExtension(originalFileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new InvalidOperationException("Unsupported file type.");

        if (stream.CanSeek)
        {
            if (stream.Length > MaxBytes)
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
