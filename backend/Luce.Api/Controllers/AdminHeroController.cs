using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/hero")]
[Authorize(Roles = "Admin")]
public class AdminHeroController : ControllerBase
{
    private readonly IHeroService _hero;

    public AdminHeroController(IHeroService hero) => _hero = hero;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HeroSlideAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _hero.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<HeroSlideAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _hero.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<HeroSlideAdminDto>> Create([FromBody] HeroSlideCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _hero.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<HeroSlideAdminDto>> Update(int id, [FromBody] HeroSlideUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _hero.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _hero.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
