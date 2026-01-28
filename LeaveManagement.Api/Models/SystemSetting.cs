using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Models;

/// <summary>
/// System setting entity for organization-wide configuration
/// Stores key-value pairs for global settings managed by admin
/// </summary>
public class SystemSetting
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(500)]
    public string Value { get; set; } = string.Empty;
}

/// <summary>
/// Constants for system setting keys
/// Avoids magic strings throughout the application
/// </summary>
public static class SystemSettingKeys
{
    public const string CompanyName = "CompanyName";
    public const string LeaveYearStartMonth = "LeaveYearStartMonth";
    public const string MaxCarryForwardDays = "MaxCarryForwardDays";
}
