using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// Manager endpoints for leave approval workflow
/// All endpoints require MANAGER role
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MANAGER")]
public class ManagerController : ControllerBase
{
    private readonly IManagerService _managerService;
    
    public ManagerController(IManagerService managerService)
    {
        _managerService = managerService;
    }
    
    /// <summary>
    /// Get all pending leave requests
    /// GET /api/manager/leaves/pending
    /// </summary>
    [HttpGet("leaves/pending")]
    public async Task<IActionResult> GetPendingLeaves()
    {
        try
        {
            var pendingLeaves = await _managerService.GetPendingLeavesAsync();
            
            return Ok(new { data = pendingLeaves });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while fetching pending leaves" });
        }
    }
    
    /// <summary>
    /// Approve a leave request
    /// PUT /api/manager/leaves/{leaveId}/approve
    /// </summary>
    [HttpPut("leaves/{leaveId}/approve")]
    public async Task<IActionResult> ApproveLeave(int leaveId)
    {
        try
        {
            var result = await _managerService.ApproveLeaveAsync(leaveId);
            
            return Ok(new 
            { 
                message = result.Message,
                data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while approving the leave request" });
        }
    }
    
    /// <summary>
    /// Reject a leave request and rollback balance
    /// PUT /api/manager/leaves/{leaveId}/reject
    /// </summary>
    [HttpPut("leaves/{leaveId}/reject")]
    public async Task<IActionResult> RejectLeave(int leaveId)
    {
        try
        {
            var result = await _managerService.RejectLeaveAsync(leaveId);
            
            return Ok(new 
            { 
                message = result.Message,
                data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "An error occurred while rejecting the leave request" });
        }
    }
}
