using LeaveManagement.Api.Data;
using LeaveManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Repositories;

/// <summary>
/// Repository interface for SystemSetting database operations
/// </summary>
public interface ISystemSettingsRepository
{
    Task<List<SystemSetting>> GetAllAsync();
    Task<SystemSetting?> GetByKeyAsync(string key);
    Task<SystemSetting> CreateAsync(SystemSetting setting);
    Task UpdateAsync(SystemSetting setting);
    Task<bool> ExistsAsync(string key);
}

/// <summary>
/// Repository implementation for SystemSetting database operations
/// Handles all direct database access for SystemSetting entity
/// </summary>
public class SystemSettingsRepository : ISystemSettingsRepository
{
    private readonly ApplicationDbContext _context;
    
    public SystemSettingsRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Get all system settings
    /// </summary>
    public async Task<List<SystemSetting>> GetAllAsync()
    {
        return await _context.SystemSettings
            .OrderBy(s => s.Key)
            .ToListAsync();
    }
    
    /// <summary>
    /// Get a system setting by key
    /// </summary>
    public async Task<SystemSetting?> GetByKeyAsync(string key)
    {
        return await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.Key == key);
    }
    
    /// <summary>
    /// Create a new system setting
    /// </summary>
    public async Task<SystemSetting> CreateAsync(SystemSetting setting)
    {
        _context.SystemSettings.Add(setting);
        await _context.SaveChangesAsync();
        return setting;
    }
    
    /// <summary>
    /// Update an existing system setting
    /// </summary>
    public async Task UpdateAsync(SystemSetting setting)
    {
        _context.SystemSettings.Update(setting);
        await _context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Check if a setting with the given key exists
    /// </summary>
    public async Task<bool> ExistsAsync(string key)
    {
        return await _context.SystemSettings.AnyAsync(s => s.Key == key);
    }
}
