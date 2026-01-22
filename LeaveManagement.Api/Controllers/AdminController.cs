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
    private readonly ILeavePolicyService _leavePolicyService;
    
    public AdminController(IAdminService adminService, ILeavePolicyService leavePolicyService)
    {
        _adminService = adminService;
        _leavePolicyService = leavePolicyService;
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
    
    // ========================
    // LEAVE POLICY ENDPOINTS
    // ========================
    
    /// <summary>
    /// Get all leave types
    /// GET /api/admin/leave-types
    /// Admin only
    /// </summary>
    [HttpGet("leave-types")]
    public async Task<IActionResult> GetAllLeaveTypes()
    {
        var leaveTypes = await _leavePolicyService.GetAllLeaveTypesAsync();
        return Ok(leaveTypes);
    }
    
    /// <summary>
    /// Create a new leave type
    /// POST /api/admin/leave-types
    /// Admin only
    /// </summary>
    [HttpPost("leave-types")]
    public async Task<IActionResult> CreateLeaveType([FromBody] CreateLeaveTypeDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var (result, error) = await _leavePolicyService.CreateLeaveTypeAsync(request);
        
        if (error != null)
        {
            return BadRequest(new { message = error });
        }
        
        return CreatedAtAction(nameof(GetLeaveTypeById), new { id = result!.Id }, result);
    }
    
    /// <summary>
    /// Get a leave type by ID
    /// GET /api/admin/leave-types/{id}
    /// Admin only
    /// </summary>
    [HttpGet("leave-types/{id}")]
    public async Task<IActionResult> GetLeaveTypeById(int id)
    {
        var leaveType = await _leavePolicyService.GetLeaveTypeByIdAsync(id);
        
        if (leaveType == null)
        {
            return NotFound(new { message = "Leave type not found" });
        }
        
        return Ok(leaveType);
    }
    
    /// <summary>
    /// Update a leave type's MaxDaysPerYear
    /// PUT /api/admin/leave-types/{id}
    /// Admin only
    /// Updates existing LeaveBalance records accordingly
    /// </summary>
    [HttpPut("leave-types/{id}")]
    public async Task<IActionResult> UpdateLeaveType(int id, [FromBody] UpdateLeaveTypeDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var (result, error) = await _leavePolicyService.UpdateLeaveTypeAsync(id, request);
        
        if (error != null)
        {
            if (error == "Leave type not found")
            {
                return NotFound(new { message = error });
            }
            return BadRequest(new { message = error });
        }
        
        return Ok(result);
    }
    
    /// <summary>
    /// Delete a leave type
    /// DELETE /api/admin/leave-types/{id}
    /// Admin only
    /// Blocks deletion if leave requests exist
    /// </summary>
    [HttpDelete("leave-types/{id}")]
    public async Task<IActionResult> DeleteLeaveType(int id)
    {
        var (success, error) = await _leavePolicyService.DeleteLeaveTypeAsync(id);
        
        if (error != null)
        {
            if (error == "Leave type not found")
            {
                return NotFound(new { message = error });
            }
            return BadRequest(new { message = error });
        }
        
        return Ok(new { message = "Leave type deleted successfully" });
    }
}
