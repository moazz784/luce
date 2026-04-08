using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/news")]
[Authorize(Roles = "Admin")]
public class AdminNewsController : ControllerBase
{
    private readonly INewsService _news;

    public AdminNewsController(INewsService news) => _news = news;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NewsAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _news.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NewsAdminDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _news.GetByIdAsync(id, cancellationToken);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<NewsAdminDto>> Create([FromBody] NewsCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _news.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<NewsAdminDto>> Update(int id, [FromBody] NewsUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _news.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
            return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _news.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
