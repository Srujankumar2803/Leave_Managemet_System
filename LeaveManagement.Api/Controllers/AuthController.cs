using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

// In a clean backend architecture, Models represent database entities,
// DTOs define the data that comes into and goes out of the API, 
//the Data layer (DbContext) maps models to database tables and defines 
//constraints while migrations handle actual table creation, the Repository 
//layer abstracts database access and exposes safe data operations, the Service layer
// contains business logic using repositories, and finally Controllers act as entry points 
//that receive requests, call services, and return responses.

/// <summary>
/// Authentication controller - handles user registration and login
/// </summary>
[ApiController]
[Route("api/[controller]")] // api/auth and auth coming from AuthController by removing Controller suffix and converting to lowercase
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    

    /// Register a new user
    /// POST /api/auth/register --> AuthController → auth (Controller suffix removed, lowercase)-> 
    /// auth so finally api/auth/register

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid) // ModelState.IsValid checks [Required], [EmailAddress], etc.
        {
            return BadRequest(ModelState);
        }
        
        var result = await _authService.RegisterUserAsync(request);
        
        if (result == null)
        {
            return BadRequest(new { message = "User with this email already exists" });
        }
        
        return Ok(result); // where result is AuthResponseDto containing JWT token and user info
    }
    
    /// <summary>
    /// Login user and get JWT token
    /// POST /api/auth/login
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid) //ModelState.IsValid checks [Required], [EmailAddress], etc.
        {
            return BadRequest(ModelState);
        }
        
        var result = await _authService.LoginAsync(request);
        
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }
        
        return Ok(result); // where result is AuthResponseDto containing JWT token and user info
    }
}
