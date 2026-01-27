using System.Security.Claims;
using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// Profile controller for user account management
/// All endpoints require authentication
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    
    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }
    
    /// <summary>
    /// Get current user's profile
    /// Extracts user ID from JWT claims
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }
        
        var profile = await _profileService.GetProfileAsync(userId.Value);
        
        if (profile == null)
        {
            return NotFound("User not found");
        }
        
        return Ok(profile);
    }
    
    /// <summary>
    /// Change current user's password
    /// </summary>
    [HttpPut("password")]
    public async Task<ActionResult<PasswordChangeResponseDto>> ChangePassword([FromBody] ChangePasswordDto request)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized("Invalid token");
        }
        
        var result = await _profileService.ChangePasswordAsync(userId.Value, request);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }
        
        return Ok(result);
    }
    
    /// <summary>
    /// Extract user ID from JWT claims
    /// </summary>
    private int? GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return null;
        }
        return userId;
    }
}
