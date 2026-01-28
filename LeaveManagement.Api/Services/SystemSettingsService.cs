using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Models;
using LeaveManagement.Api.Repositories;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Service interface for system settings operations
/// </summary>
public interface ISystemSettingsService
{
    Task<List<SystemSettingDto>> GetAllSettingsAsync();
    Task<(List<SystemSettingDto>? Result, string? Error)> UpdateSettingsAsync(List<UpdateSystemSettingDto> settings);
}

/// <summary>
/// Service implementation for system settings
/// Handles business logic for organization-wide configuration
/// </summary>
public class SystemSettingsService : ISystemSettingsService
{
    private readonly ISystemSettingsRepository _repository;
    
    public SystemSettingsService(ISystemSettingsRepository repository)
    {
        _repository = repository;
    }
    
    /// <summary>
    /// Get all system settings
    /// Returns list of key-value pairs
    /// </summary>
    public async Task<List<SystemSettingDto>> GetAllSettingsAsync()
    {
        var settings = await _repository.GetAllAsync();
        
        return settings.Select(s => new SystemSettingDto
        {
            Key = s.Key,
            Value = s.Value
        }).ToList();
    }
    
    /// <summary>
    /// Update system settings
    /// Creates new settings if they don't exist, updates if they do
    /// </summary>
    public async Task<(List<SystemSettingDto>? Result, string? Error)> UpdateSettingsAsync(List<UpdateSystemSettingDto> settings)
    {
        // Validate no empty keys or values
        foreach (var setting in settings)
        {
            if (string.IsNullOrWhiteSpace(setting.Key))
            {
                return (null, "Setting key cannot be empty");
            }
            
            if (string.IsNullOrWhiteSpace(setting.Value))
            {
                return (null, $"Value for setting '{setting.Key}' cannot be empty");
            }
        }
        
        // Process each setting
        foreach (var settingDto in settings)
        {
            var existingSetting = await _repository.GetByKeyAsync(settingDto.Key);
            
            if (existingSetting != null)
            {
                // Update existing setting
                existingSetting.Value = settingDto.Value.Trim();
                await _repository.UpdateAsync(existingSetting);
            }
            else
            {
                // Create new setting
                var newSetting = new SystemSetting
                {
                    Key = settingDto.Key.Trim(),
                    Value = settingDto.Value.Trim()
                };
                await _repository.CreateAsync(newSetting);
            }
        }
        
        // Return updated settings
        return (await GetAllSettingsAsync(), null);
    }
}
