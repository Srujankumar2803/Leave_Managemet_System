using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// Admin controller - handles admin-only operations
/// Protected with [Authorize(Roles = "ADMIN")]
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")] // Only ADMIN role can access these endpoints
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    
    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }
    
    /// <summary>
    /// Get all users in the system
    /// GET /api/admin/users
    /// Admin only
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }
    
    /// <summary>
    /// Update user role
    /// PUT /api/admin/users/{userId}/role
    /// Admin only
    /// </summary>
    [HttpPut("users/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UpdateRoleDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var success = await _adminService.UpdateUserRoleAsync(userId, request.Role);
        
        if (!success)
        {
            return NotFound(new { message = "User not found or invalid role" });
        }
        
        return Ok(new { message = "Role updated successfully" });
    }
}
