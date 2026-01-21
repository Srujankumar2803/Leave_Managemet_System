using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Models;

/// <summary>
/// LeaveType model - defines types of leave (CL, SL, EL, etc.)
/// </summary>
public class LeaveType
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g., "Casual Leave", "Sick Leave"
    
    [Required]
    public int MaxDaysPerYear { get; set; } // Maximum days allowed per year
}
