using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LeaveManagement.Api.Models;

/// <summary>
/// LeaveBalance model - tracks remaining leave days for each user per leave type
/// </summary>
public class LeaveBalance
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required]
    public int LeaveTypeId { get; set; }
    
    [Required]
    public int RemainingDays { get; set; } // Days remaining for this leave type
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
    
    [ForeignKey(nameof(LeaveTypeId))]
    public LeaveType LeaveType { get; set; } = null!;
}
