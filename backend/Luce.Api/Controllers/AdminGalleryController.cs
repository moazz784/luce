using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/gallery")]
[Authorize(Roles = "Admin")]
public class AdminGalleryController : ControllerBase
{
    private readonly IGalleryService _gallery;

    public AdminGalleryController(IGalleryService gallery) => _gallery = gallery;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GalleryAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _gallery.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GalleryAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _gallery.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<GalleryAdminDto>> Create([FromBody] GalleryCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _gallery.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { title = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<GalleryAdminDto>> Update(int id, [FromBody] GalleryUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await _gallery.UpdateAsync(id, dto, cancellationToken);
            if (updated is null)
                return NotFound();
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { title = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _gallery.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
