using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.Api.Controllers;

/// <summary>
/// System Settings controller - handles organization-wide configuration
/// Protected with [Authorize(Roles = "ADMIN")] - only admin can manage settings
/// </summary>
[ApiController]
[Route("api/admin/system-settings")]
[Authorize(Roles = "ADMIN")]
public class SystemSettingsController : ControllerBase
{
    private readonly ISystemSettingsService _systemSettingsService;
    
    public SystemSettingsController(ISystemSettingsService systemSettingsService)
    {
        _systemSettingsService = systemSettingsService;
    }
    
    /// <summary>
    /// Get all system settings
    /// GET /api/admin/system-settings
    /// Admin only
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllSettings()
    {
        var settings = await _systemSettingsService.GetAllSettingsAsync();
        return Ok(settings);
    }
    
    /// <summary>
    /// Update system settings
    /// PUT /api/admin/system-settings
    /// Admin only
    /// Body: { settings: [{ key, value }, ...] }
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateSystemSettingsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var (result, error) = await _systemSettingsService.UpdateSettingsAsync(request.Settings);
        
        if (error != null)
        {
            return BadRequest(new { message = error });
        }
        
        return Ok(result);
    }
}
