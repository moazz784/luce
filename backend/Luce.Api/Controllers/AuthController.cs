using System.Security.Claims;
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
    public const string AuthCookieName = "access_token";

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

    [Authorize]
    [HttpGet("me")]
    public ActionResult<AuthMeResponse> Me()
    {
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        return Ok(new AuthMeResponse(
            User.FindFirstValue(ClaimTypes.Email) ?? "",
            User.Identity?.Name ?? "",
            roles));
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        DeleteAuthCookie();
        return Ok();
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
            AppendAuthCookie(result);
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

            AppendAuthCookie(result);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Registration failed", Detail = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("register/start")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterStart([FromBody] RegisterStartRequest request, CancellationToken cancellationToken)
    {
        try
        {
            await _auth.StartRegistrationAsync(request, cancellationToken);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Registration failed", Detail = ex.Message });
        }
    }

    [AllowAnonymous]
    [HttpPost("register/verify")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> RegisterVerify([FromBody] RegisterVerifyRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _auth.CompleteRegistrationAsync(request, cancellationToken);
            AppendAuthCookie(result);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ProblemDetails { Title = "Registration failed", Detail = ex.Message });
        }
    }

    private void AppendAuthCookie(AuthResponse auth)
    {
        var opts = new CookieOptions
        {
            HttpOnly = true,
            Path = "/",
            Expires = auth.ExpiresAt.UtcDateTime,
        };

        var host = Request.Host.Host;
        if (host.Contains("localhost", StringComparison.OrdinalIgnoreCase) || host == "127.0.0.1")
        {
            opts.SameSite = SameSiteMode.Lax;
            opts.Secure = false;
        }
        else
        {
            opts.SameSite = SameSiteMode.None;
            opts.Secure = true;
        }

        Response.Cookies.Append(AuthCookieName, auth.AccessToken, opts);
    }

    /// <summary>
    /// Must use the same Path, SameSite, and Secure flags as <see cref="AppendAuthCookie"/> or the browser may not remove the cookie.
    /// </summary>
    private void DeleteAuthCookie()
    {
        var opts = new CookieOptions
        {
            HttpOnly = true,
            Path = "/",
            Expires = DateTime.UnixEpoch,
        };

        var host = Request.Host.Host;
        if (host.Contains("localhost", StringComparison.OrdinalIgnoreCase) || host == "127.0.0.1")
        {
            opts.SameSite = SameSiteMode.Lax;
            opts.Secure = false;
        }
        else
        {
            opts.SameSite = SameSiteMode.None;
            opts.Secure = true;
        }

        Response.Cookies.Delete(AuthCookieName, opts);
    }
}

public sealed record RegistrationStatusResponse(bool AllowRegister);

public sealed record AuthMeResponse(string Email, string UserName, IReadOnlyList<string> Roles);
