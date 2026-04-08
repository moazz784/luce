using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/awards")]
[Authorize(Roles = "Admin")]
public class AdminAwardsController : ControllerBase
{
    private readonly IAwardService _awards;

    public AdminAwardsController(IAwardService awards) => _awards = awards;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AwardAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _awards.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AwardAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _awards.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<AwardAdminDto>> Create([FromBody] AwardCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _awards.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AwardAdminDto>> Update(int id, [FromBody] AwardUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _awards.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _awards.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
