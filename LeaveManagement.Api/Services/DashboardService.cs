using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Dashboard service interface
/// </summary>
public interface IDashboardService
{
    Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(int userId);
    Task<ManagerDashboardDto> GetManagerDashboardAsync();
    Task<AdminDashboardDto> GetAdminDashboardAsync();
}

/// <summary>
/// Dashboard service implementation
/// Provides summary data for role-based dashboards
/// </summary>
public class DashboardService : IDashboardService
{
    private readonly ILeaveRepository _leaveRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILeaveTypeRepository _leaveTypeRepository;
    
    public DashboardService(
        ILeaveRepository leaveRepository, 
        IUserRepository userRepository,
        ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveRepository = leaveRepository;
        _userRepository = userRepository;
        _leaveTypeRepository = leaveTypeRepository;
    }
    
    /// <summary>
    /// Get employee dashboard summary
    /// Shows leave balances, pending/approved counts, and recent leaves
    /// </summary>
    public async Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(int userId)
    {
        // Get all leave requests for the user
        var leaveRequests = await _leaveRepository.GetUserLeaveRequestsAsync(userId);
        
        // Get leave balances
        var leaveBalances = await _leaveRepository.GetUserLeaveBalancesAsync(userId);
        
        // Count pending and approved leaves
        var pendingCount = leaveRequests.Count(lr => lr.Status == "PENDING");
        var approvedCount = leaveRequests.Count(lr => lr.Status == "APPROVED");
        
        // Map leave balances to summary
        var balanceSummary = leaveBalances.Select(lb => new LeaveBalanceSummaryDto
        {
            LeaveTypeName = lb.LeaveType.Name,
            RemainingDays = lb.RemainingDays,
            MaxDaysPerYear = lb.LeaveType.MaxDaysPerYear
        }).ToList();
        
        // Get recent 5 leaves
        var recentLeaves = leaveRequests
            .OrderByDescending(lr => lr.AppliedAt)
            .Take(5)
            .Select(lr => new RecentLeaveDto
            {
                Id = lr.Id,
                LeaveTypeName = lr.LeaveType.Name,
                StartDate = lr.StartDate,
                EndDate = lr.EndDate,
                TotalDays = lr.TotalDays,
                Status = lr.Status,
                AppliedAt = lr.AppliedAt
            })
            .ToList();
        
        return new EmployeeDashboardDto
        {
            PendingLeavesCount = pendingCount,
            ApprovedLeavesCount = approvedCount,
            RemainingLeaveSummary = balanceSummary,
            RecentLeaves = recentLeaves
        };
    }
    
    /// <summary>
    /// Get manager dashboard summary
    /// Shows pending approvals, approved today count, and recent decisions
    /// </summary>
    public async Task<ManagerDashboardDto> GetManagerDashboardAsync()
    {
        // Get all pending leave requests
        var pendingLeaves = await _leaveRepository.GetPendingLeaveRequestsAsync();
        
        // Get all leave requests for recent decisions
        var allRequests = await _leaveRepository.GetAllLeaveRequestsAsync();
        
        // Count approved today - filter leaves that were approved/rejected today
        var today = DateTime.Today;
        var approvedToday = allRequests
            .Where(lr => lr.Status == "APPROVED" && lr.AppliedAt.Date == today)
            .Count();
        
        // Get recent decisions (approved or rejected) - last 5
        var recentDecisions = allRequests
            .Where(lr => lr.Status == "APPROVED" || lr.Status == "REJECTED")
            .OrderByDescending(lr => lr.AppliedAt)
            .Take(5)
            .Select(lr => new RecentDecisionDto
            {
                LeaveId = lr.Id,
                EmployeeName = lr.User.Name,
                LeaveTypeName = lr.LeaveType.Name,
                StartDate = lr.StartDate,
                EndDate = lr.EndDate,
                TotalDays = lr.TotalDays,
                Status = lr.Status,
                DecidedAt = lr.AppliedAt
            })
            .ToList();
        
        return new ManagerDashboardDto
        {
            PendingApprovalsCount = pendingLeaves.Count,
            ApprovedTodayCount = approvedToday,
            RecentDecisions = recentDecisions
        };
    }
    
    /// <summary>
    /// Get admin dashboard summary
    /// Shows user statistics, leave types count, and total requests
    /// </summary>
    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        // Get all users
        var allUsers = await _userRepository.GetAllAsync();
        
        // Count users by role
        var employeeCount = allUsers.Count(u => u.Role == "EMPLOYEE");
        var managerCount = allUsers.Count(u => u.Role == "MANAGER");
        var adminCount = allUsers.Count(u => u.Role == "ADMIN");
        
        // Get all leave types
        var leaveTypes = await _leaveTypeRepository.GetAllAsync();
        
        // Get total leave requests count (optimized)
        var totalRequests = await _leaveRepository.GetTotalLeaveRequestsCountAsync();
        
        return new AdminDashboardDto
        {
            TotalUsers = allUsers.Count,
            UsersByRole = new UsersByRoleDto
            {
                Employees = employeeCount,
                Managers = managerCount,
                Admins = adminCount
            },
            LeaveTypesCount = leaveTypes.Count,
            TotalLeaveRequests = totalRequests
        };
    }
}
