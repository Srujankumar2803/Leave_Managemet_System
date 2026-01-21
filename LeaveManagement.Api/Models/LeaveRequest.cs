using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LeaveManagement.Api.Models;

/// <summary>
/// LeaveRequest model - represents a leave application by a user
/// </summary>
public class LeaveRequest
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required]
    public int LeaveTypeId { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    [Required]
    public int TotalDays { get; set; } // Calculated total days
    
    [MaxLength(500)]
    public string? Reason { get; set; } // Optional reason for leave
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "PENDING"; // PENDING | APPROVED | REJECTED
    
    [Required]
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? ReviewedAt { get; set; } // When manager approved/rejected
    
    public int? ReviewedBy { get; set; } // Manager who reviewed
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;
    
    [ForeignKey(nameof(LeaveTypeId))]
    public LeaveType LeaveType { get; set; } = null!;
    
    [ForeignKey(nameof(ReviewedBy))]
    public User? Reviewer { get; set; }
}
