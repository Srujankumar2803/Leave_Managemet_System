using LeaveManagement.Api.Data;
using LeaveManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Repositories;

/// <summary>
/// LeaveType repository interface for leave policy management
/// </summary>
public interface ILeaveTypeRepository
{
    Task<List<LeaveType>> GetAllAsync();
    Task<LeaveType?> GetByIdAsync(int id);
    Task<LeaveType?> GetByNameAsync(string name);
    Task<LeaveType> CreateAsync(LeaveType leaveType);
    Task UpdateAsync(LeaveType leaveType);
    Task<bool> DeleteAsync(int id);
    Task<bool> HasLeaveBalancesAsync(int leaveTypeId);
    Task<bool> HasLeaveRequestsAsync(int leaveTypeId);
    Task<List<LeaveBalance>> GetAllBalancesByLeaveTypeIdAsync(int leaveTypeId);
    Task UpdateLeaveBalancesAsync(List<LeaveBalance> balances);
    Task CreateLeaveBalancesForAllUsersAsync(int leaveTypeId, int maxDaysPerYear);
}

/// <summary>
/// LeaveType repository implementation
/// Handles all database operations for leave type/policy management
/// </summary>
public class LeaveTypeRepository : ILeaveTypeRepository
{
    private readonly ApplicationDbContext _context;
    
    public LeaveTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Get all leave types
    /// </summary>
    public async Task<List<LeaveType>> GetAllAsync()
    {
        return await _context.LeaveTypes
            .OrderBy(lt => lt.Name)
            .ToListAsync();
    }
    
    /// <summary>
    /// Get leave type by ID
    /// </summary>
    public async Task<LeaveType?> GetByIdAsync(int id)
    {
        return await _context.LeaveTypes.FindAsync(id);
    }
    
    /// <summary>
    /// Get leave type by name (for uniqueness check)
    /// </summary>
    public async Task<LeaveType?> GetByNameAsync(string name)
    {
        return await _context.LeaveTypes
            .FirstOrDefaultAsync(lt => lt.Name.ToLower() == name.ToLower());
    }
    
    /// <summary>
    /// Create a new leave type
    /// </summary>
    public async Task<LeaveType> CreateAsync(LeaveType leaveType)
    {
        _context.LeaveTypes.Add(leaveType);
        await _context.SaveChangesAsync();
        return leaveType;
    }
    
    /// <summary>
    /// Update an existing leave type
    /// </summary>
    public async Task UpdateAsync(LeaveType leaveType)
    {
        _context.LeaveTypes.Update(leaveType);
        await _context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Delete a leave type by ID
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var leaveType = await _context.LeaveTypes.FindAsync(id);
        if (leaveType == null)
        {
            return false;
        }
        
        _context.LeaveTypes.Remove(leaveType);
        await _context.SaveChangesAsync();
        return true;
    }
    
    /// <summary>
    /// Check if any leave balances exist for a leave type
    /// </summary>
    public async Task<bool> HasLeaveBalancesAsync(int leaveTypeId)
    {
        return await _context.LeaveBalances.AnyAsync(lb => lb.LeaveTypeId == leaveTypeId);
    }
    
    /// <summary>
    /// Check if any leave requests exist for a leave type
    /// </summary>
    public async Task<bool> HasLeaveRequestsAsync(int leaveTypeId)
    {
        return await _context.LeaveRequests.AnyAsync(lr => lr.LeaveTypeId == leaveTypeId);
    }
    
    /// <summary>
    /// Get all leave balances for a specific leave type
    /// </summary>
    public async Task<List<LeaveBalance>> GetAllBalancesByLeaveTypeIdAsync(int leaveTypeId)
    {
        return await _context.LeaveBalances
            .Where(lb => lb.LeaveTypeId == leaveTypeId)
            .ToListAsync();
    }
    
    /// <summary>
    /// Update multiple leave balances in a single transaction
    /// </summary>
    public async Task UpdateLeaveBalancesAsync(List<LeaveBalance> balances)
    {
        _context.LeaveBalances.UpdateRange(balances);
        await _context.SaveChangesAsync();
    }
    
    /// <summary>
    /// Create leave balances for all existing users when a new leave type is created
    /// </summary>
    public async Task CreateLeaveBalancesForAllUsersAsync(int leaveTypeId, int maxDaysPerYear)
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();
        
        var newBalances = userIds.Select(userId => new LeaveBalance
        {
            UserId = userId,
            LeaveTypeId = leaveTypeId,
            RemainingDays = maxDaysPerYear
        }).ToList();
        
        await _context.LeaveBalances.AddRangeAsync(newBalances);
        await _context.SaveChangesAsync();
    }
}
