using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/alumni")]
[Authorize(Roles = "Admin")]
public class AdminAlumniController : ControllerBase
{
    private readonly IAlumniService _alumni;

    public AdminAlumniController(IAlumniService alumni) => _alumni = alumni;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AlumniAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _alumni.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AlumniAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _alumni.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<AlumniAdminDto>> Create([FromBody] AlumniCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _alumni.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AlumniAdminDto>> Update(int id, [FromBody] AlumniUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _alumni.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _alumni.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
