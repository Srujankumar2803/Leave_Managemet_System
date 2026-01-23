using System.Security.Claims;
using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// Dashboard controller - provides role-based summary data
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize] // All endpoints require authentication
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    
    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }
    
    /// <summary>
    /// Get employee dashboard summary
    /// GET /api/dashboard/employee
    /// Returns leave balances, pending/approved counts, and recent leaves
    /// </summary>
    [HttpGet("employee")]
    public async Task<IActionResult> GetEmployeeDashboard()
    {
        // Extract UserId from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { message = "User ID not found in token" });
        }
        
        var userId = int.Parse(userIdClaim.Value);
        
        var dashboard = await _dashboardService.GetEmployeeDashboardAsync(userId);
        return Ok(dashboard);
    }
    
    /// <summary>
    /// Get manager dashboard summary
    /// GET /api/dashboard/manager
    /// Returns pending approvals, approved today count, and recent decisions
    /// Manager role required
    /// </summary>
    [HttpGet("manager")]
    [Authorize(Roles = "MANAGER")]
    public async Task<IActionResult> GetManagerDashboard()
    {
        var dashboard = await _dashboardService.GetManagerDashboardAsync();
        return Ok(dashboard);
    }
    
    /// <summary>
    /// Get admin dashboard summary
    /// GET /api/dashboard/admin
    /// Returns user statistics, leave types count, and total requests
    /// Admin role required
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAdminDashboard()
    {
        var dashboard = await _dashboardService.GetAdminDashboardAsync();
        return Ok(dashboard);
    }
}
