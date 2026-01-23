using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Dtos;

// ========================
// EMPLOYEE DASHBOARD DTOs
// ========================

/// <summary>
/// DTO for employee dashboard summary
/// </summary>
public class EmployeeDashboardDto
{
    public int PendingLeavesCount { get; set; }
    public int ApprovedLeavesCount { get; set; }
    public List<LeaveBalanceSummaryDto> RemainingLeaveSummary { get; set; } = new();
    public List<RecentLeaveDto> RecentLeaves { get; set; } = new();
}

/// <summary>
/// DTO for leave balance summary on dashboard
/// </summary>
public class LeaveBalanceSummaryDto
{
    public string LeaveTypeName { get; set; } = string.Empty;
    public int RemainingDays { get; set; }
    public int MaxDaysPerYear { get; set; }
}

/// <summary>
/// DTO for recent leave item
/// </summary>
public class RecentLeaveDto
{
    public int Id { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}

// ========================
// MANAGER DASHBOARD DTOs
// ========================

/// <summary>
/// DTO for manager dashboard summary
/// </summary>
public class ManagerDashboardDto
{
    public int PendingApprovalsCount { get; set; }
    public int ApprovedTodayCount { get; set; }
    public List<RecentDecisionDto> RecentDecisions { get; set; } = new();
}

/// <summary>
/// DTO for recent approval/rejection decision
/// </summary>
public class RecentDecisionDto
{
    public int LeaveId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string LeaveTypeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string Status { get; set; } = string.Empty; // APPROVED or REJECTED
    public DateTime DecidedAt { get; set; }
}

// ========================
// ADMIN DASHBOARD DTOs
// ========================

/// <summary>
/// DTO for admin dashboard summary
/// </summary>
public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public UsersByRoleDto UsersByRole { get; set; } = new();
    public int LeaveTypesCount { get; set; }
    public int TotalLeaveRequests { get; set; }
}

/// <summary>
/// DTO for users breakdown by role
/// </summary>
public class UsersByRoleDto
{
    public int Employees { get; set; }
    public int Managers { get; set; }
    public int Admins { get; set; }
}
