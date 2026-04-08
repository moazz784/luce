using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = "Admin")]
public class AdminMediaController : ControllerBase
{
    private readonly IMediaStorageService _media;

    public AdminMediaController(IMediaStorageService media) => _media = media;

    [HttpPost]
    [RequestSizeLimit(5 * 1024 * 1024)]
    [ProducesResponseType(typeof(MediaUploadResultDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MediaUploadResultDto>> Upload(IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new ProblemDetails { Title = "No file uploaded." });

        await using var stream = file.OpenReadStream();
        var result = await _media.SaveAsync(stream, file.FileName, file.ContentType ?? "application/octet-stream", cancellationToken);

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        if (!result.Url.StartsWith("/"))
            return Ok(new MediaUploadResultDto { Url = result.Url });

        return Ok(new MediaUploadResultDto { Url = baseUrl + result.Url });
    }
}
