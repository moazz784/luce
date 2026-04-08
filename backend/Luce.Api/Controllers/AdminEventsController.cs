using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/events")]
[Authorize(Roles = "Admin")]
public class AdminEventsController : ControllerBase
{
    private readonly IEventService _events;

    public AdminEventsController(IEventService events) => _events = events;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EventAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _events.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _events.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<EventAdminDto>> Create([FromBody] EventCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _events.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<EventAdminDto>> Update(int id, [FromBody] EventUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _events.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _events.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
