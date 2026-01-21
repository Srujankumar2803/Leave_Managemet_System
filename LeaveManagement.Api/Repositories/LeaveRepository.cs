using LeaveManagement.Api.Data;
using LeaveManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Repositories;

/// <summary>
/// Leave repository interface
/// </summary>
public interface ILeaveRepository
{
    Task<LeaveBalance?> GetLeaveBalanceAsync(int userId, int leaveTypeId);
    Task<bool> HasOverlappingLeaveAsync(int userId, DateTime startDate, DateTime endDate);
    Task<LeaveRequest> CreateLeaveRequestAsync(LeaveRequest leaveRequest);
    Task UpdateLeaveBalanceAsync(LeaveBalance leaveBalance);
    Task<List<LeaveRequest>> GetUserLeaveRequestsAsync(int userId);
    Task<LeaveType?> GetLeaveTypeByIdAsync(int leaveTypeId);
    Task<List<LeaveRequest>> GetPendingLeaveRequestsAsync();
    Task<LeaveRequest?> GetLeaveRequestByIdAsync(int leaveId);
    Task UpdateLeaveRequestAsync(LeaveRequest leaveRequest);
}

/// <summary>
/// Leave repository implementation
/// Handles all database operations for leave management
/// </summary>
public class LeaveRepository : ILeaveRepository
{
    private readonly ApplicationDbContext _context;
    
    public LeaveRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Get leave balance for a user and leave type
    /// </summary>
    public async Task<LeaveBalance?> GetLeaveBalanceAsync(int userId, int leaveTypeId)
    {
        return await _context.LeaveBalances
            .Include(lb => lb.LeaveType)
            .FirstOrDefaultAsync(lb => lb.UserId == userId && lb.LeaveTypeId == leaveTypeId);
    }
    
    /// <summary>
    /// Check if user has overlapping leave request in date range
    /// </summary>
    public async Task<bool> HasOverlappingLeaveAsync(int userId, DateTime startDate, DateTime endDate)
    {
        return await _context.LeaveRequests
            .AnyAsync(lr => 
                lr.UserId == userId &&
                lr.Status != "REJECTED" && // Only consider pending or approved leaves
                (
                    (lr.StartDate <= startDate && lr.EndDate >= startDate) || // Overlaps at start
                    (lr.StartDate <= endDate && lr.EndDate >= endDate) ||     // Overlaps at end
                    (lr.StartDate >= startDate && lr.EndDate <= endDate)      // Completely inside
                )
            );
    }
    
    /// <summary>
    /// Create a new leave request
    /// </summary>
    public async Task<LeaveRequest> CreateLeaveRequestAsync(LeaveRequest leaveRequest)
    {
        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync();
        
        // Load navigation properties
        await _context.Entry(leaveRequest)
            .Reference(lr => lr.User)
            .LoadAsync();
        await _context.Entry(leaveRequest)
            .Reference(lr => lr.LeaveType)
            .LoadAsync();
            
        return leaveRequest;
    }
    
    /// <summary>
    /// Update leave balance
    /// </summary>
    public async Task UpdateLeaveBalanceAsync(LeaveBalance leaveBalance)
    {
        _context.LeaveBalances.Update(leaveBalance);
        await _context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Get all leave requests for a user
    /// </summary>
    public async Task<List<LeaveRequest>> GetUserLeaveRequestsAsync(int userId)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.User)
            .Where(lr => lr.UserId == userId)
            .OrderByDescending(lr => lr.AppliedAt)
            .ToListAsync();
    }
    
    /// <summary>
    /// Get leave type by ID
    /// </summary>
    public async Task<LeaveType?> GetLeaveTypeByIdAsync(int leaveTypeId)
    {
        return await _context.LeaveTypes.FindAsync(leaveTypeId);
    }
    
    /// <summary>
    /// Get all pending leave requests (for manager approval)
    /// </summary>
    public async Task<List<LeaveRequest>> GetPendingLeaveRequestsAsync()
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.User)
            .Where(lr => lr.Status == "PENDING")
            .OrderBy(lr => lr.AppliedAt)
            .ToListAsync();
    }
    
    /// <summary>
    /// Get leave request by ID
    /// </summary>
    public async Task<LeaveRequest?> GetLeaveRequestByIdAsync(int leaveId)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.User)
            .FirstOrDefaultAsync(lr => lr.Id == leaveId);
    }
    
    /// <summary>
    /// Update leave request
    /// </summary>
    public async Task UpdateLeaveRequestAsync(LeaveRequest leaveRequest)
    {
        _context.LeaveRequests.Update(leaveRequest);
        await _context.SaveChangesAsync();
    }
}
