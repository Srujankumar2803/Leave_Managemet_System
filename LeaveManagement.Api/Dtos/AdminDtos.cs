using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Dtos;

/// <summary>
/// DTO for user list response (admin view)
/// Returns user details without sensitive data
/// </summary>
public class UserListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating user role (admin only)
/// </summary>
public class UpdateRoleDto
{
    [Required]
    [RegularExpression("^(EMPLOYEE|MANAGER|ADMIN)$", ErrorMessage = "Role must be EMPLOYEE, MANAGER, or ADMIN")]
    public string Role { get; set; } = string.Empty;
}

/// <summary>
/// DTO for pending leave request (manager view)
/// </summary>
public class PendingLeaveDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string? Reason { get; set; }
    public DateTime AppliedAt { get; set; }
}

/// <summary>
/// DTO for approve/reject response
/// </summary>
public class ApprovalResponseDto
{
    public int LeaveId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

// ========================
// LEAVE POLICY DTOs
// ========================

/// <summary>
/// DTO for leave type response (read operations)
/// </summary>
public class LeaveTypeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int MaxDaysPerYear { get; set; }
}

/// <summary>
/// DTO for creating a new leave type
/// </summary>
public class CreateLeaveTypeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 365, ErrorMessage = "MaxDaysPerYear must be between 1 and 365")]
    public int MaxDaysPerYear { get; set; }
}

/// <summary>
/// DTO for updating a leave type (only MaxDaysPerYear can be updated)
/// </summary>
public class UpdateLeaveTypeDto
{
    [Required]
    [Range(1, 365, ErrorMessage = "MaxDaysPerYear must be between 1 and 365")]
    public int MaxDaysPerYear { get; set; }
}
