using Luce.Application.Abstractions.Auth;
using Luce.Infrastructure.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Luce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly AuthOptions _authOptions;

    public AuthController(IAuthService auth, IOptions<AuthOptions> authOptions)
    {
        _auth = auth;
        _authOptions = authOptions.Value;
    }

    [AllowAnonymous]
    [HttpGet("registration-status")]
    public ActionResult<RegistrationStatusResponse> RegistrationStatus()
    {
        return Ok(new RegistrationStatusResponse(_authOptions.AllowRegister));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _auth.LoginAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new ProblemDetails { Title = "Login failed", Detail = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _auth.RegisterUserAsync(request, cancellationToken);
            if (result is null)
                return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails { Title = "Registration is disabled." });

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Registration failed", Detail = ex.Message });
        }
    }
}

public sealed record RegistrationStatusResponse(bool AllowRegister);
