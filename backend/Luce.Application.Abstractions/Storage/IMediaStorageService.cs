using Luce.Application.Abstractions.Dtos;

namespace Luce.Application.Abstractions.Storage;

public interface IMediaStorageService
{
    Task<MediaUploadResultDto> SaveAsync(Stream stream, string originalFileName, string contentType, CancellationToken cancellationToken = default);
}
