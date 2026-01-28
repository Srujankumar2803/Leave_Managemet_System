using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Dtos;

/// <summary>
/// DTO for returning a system setting
/// </summary>
public class SystemSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating a single system setting
/// </summary>
public class UpdateSystemSettingDto
{
    [Required(ErrorMessage = "Key is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Key must be between 1 and 100 characters")]
    public string Key { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Value is required")]
    [StringLength(500, ErrorMessage = "Value cannot exceed 500 characters")]
    public string Value { get; set; } = string.Empty;
}

/// <summary>
/// DTO for bulk updating system settings
/// </summary>
public class UpdateSystemSettingsRequest
{
    [Required(ErrorMessage = "Settings list is required")]
    [MinLength(1, ErrorMessage = "At least one setting is required")]
    public List<UpdateSystemSettingDto> Settings { get; set; } = new();
}
