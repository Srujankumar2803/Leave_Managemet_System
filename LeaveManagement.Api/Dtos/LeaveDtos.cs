using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Dtos;

/// <summary>
/// DTO for applying leave request
/// </summary>
public class ApplyLeaveRequestDto
{
    [Required]
    public int LeaveTypeId { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    [Required]
    public DateTime EndDate { get; set; }
    
    [MaxLength(500)]
    public string? Reason { get; set; }
}

/// <summary>
/// DTO for leave request response
/// </summary>
public class LeaveResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string? Reason { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}

/// <summary>
/// DTO for leave balance response
/// </summary>
public class LeaveBalanceDto
{
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public int RemainingDays { get; set; }
    public int MaxDaysPerYear { get; set; }
}
