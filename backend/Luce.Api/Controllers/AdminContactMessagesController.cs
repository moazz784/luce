using Luce.Application.Abstractions.Dtos;
using Luce.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/admin/contact-messages")]
[Authorize(Roles = "Admin")]
public class AdminContactMessagesController : ControllerBase
{
    private readonly IContactService _contact;

    public AdminContactMessagesController(IContactService contact) => _contact = contact;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ContactMessageAdminDto>>> List(CancellationToken cancellationToken)
    {
        var list = await _contact.GetAllAsync(cancellationToken);
        return Ok(list);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ok = await _contact.DeleteAsync(id, cancellationToken);
        if (!ok)
            return NotFound();
        return NoContent();
    }
}
