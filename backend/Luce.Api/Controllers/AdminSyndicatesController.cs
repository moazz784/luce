using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/syndicates")]
[Authorize(Roles = "Admin")]
public class AdminSyndicatesController : ControllerBase
{
    private readonly ISyndicateService _syndicates;

    public AdminSyndicatesController(ISyndicateService syndicates) => _syndicates = syndicates;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SyndicateAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _syndicates.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SyndicateAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _syndicates.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<SyndicateAdminDto>> Create([FromBody] SyndicateCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _syndicates.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SyndicateAdminDto>> Update(int id, [FromBody] SyndicateUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _syndicates.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _syndicates.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
