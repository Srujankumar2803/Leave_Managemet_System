using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// Leave management endpoints
/// All endpoints require authentication
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _leaveService;
    
    public LeaveController(ILeaveService leaveService)
    {
        _leaveService = leaveService;
    }
    
    /// <summary>
    /// Apply for leave
    /// POST /api/leave/apply
    /// </summary>
    [HttpPost("apply")]
    public async Task<IActionResult> ApplyLeave([FromBody] ApplyLeaveRequestDto request)
    {
        try
        {
            // Extract user ID from JWT token (secure - cannot be faked)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            
            var result = await _leaveService.ApplyLeaveAsync(userId, request);
            
            return CreatedAtAction(nameof(ApplyLeave), new { id = result.Id }, new
            {
                message = "Leave request submitted successfully",
                data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            // Business rule violations
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }
    
    /// <summary>
    /// Get all leave requests for current user
    /// GET /api/leave/my-requests
    /// </summary>
    [HttpGet("my-requests")]
    public async Task<IActionResult> GetMyLeaveRequests()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            
            var requests = await _leaveService.GetUserLeaveRequestsAsync(userId);
            
            return Ok(new { data = requests });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching leave requests" });
        }
    }
    
    /// <summary>
    /// Get leave balances for current user
    /// GET /api/leave/balances
    /// </summary>
    [HttpGet("balances")]
    public async Task<IActionResult> GetLeaveBalances()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            
            var balances = await _leaveService.GetUserLeaveBalancesAsync(userId);
            
            return Ok(new { data = balances });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching leave balances" });
        }
    }
    
    /// <summary>
    /// Get all available leave types
    /// GET /api/leave/types
    /// </summary>
    [HttpGet("types")]
    public async Task<IActionResult> GetLeaveTypes()
    {
        try
        {
            var leaveTypes = await _leaveService.GetAllLeaveTypesAsync();
            
            return Ok(new { data = leaveTypes });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching leave types" });
        }
    }
}
