using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Models;
using LeaveManagement.Api.Repositories;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Leave policy service interface for managing leave types and policies
/// </summary>
public interface ILeavePolicyService
{
    Task<List<LeaveTypeDto>> GetAllLeaveTypesAsync();
    Task<LeaveTypeDto?> GetLeaveTypeByIdAsync(int id);
    Task<(LeaveTypeDto? Result, string? Error)> CreateLeaveTypeAsync(CreateLeaveTypeDto request);
    Task<(LeaveTypeDto? Result, string? Error)> UpdateLeaveTypeAsync(int id, UpdateLeaveTypeDto request);
    Task<(bool Success, string? Error)> DeleteLeaveTypeAsync(int id);
}

/// <summary>
/// Leave policy service implementation
/// Handles leave type CRUD operations with business logic
/// Ensures data integrity when updating limits (adjusts balances accordingly)
/// </summary>
public class LeavePolicyService : ILeavePolicyService
{
    private readonly ILeaveTypeRepository _leaveTypeRepository;
    
    public LeavePolicyService(ILeaveTypeRepository leaveTypeRepository)
    {
        _leaveTypeRepository = leaveTypeRepository;
    }
    
    /// <summary>
    /// Get all leave types as DTOs
    /// </summary>
    public async Task<List<LeaveTypeDto>> GetAllLeaveTypesAsync()
    {
        var leaveTypes = await _leaveTypeRepository.GetAllAsync();
        
        return leaveTypes.Select(lt => new LeaveTypeDto
        {
            Id = lt.Id,
            Name = lt.Name,
            MaxDaysPerYear = lt.MaxDaysPerYear
        }).ToList();
    }
    
    /// <summary>
    /// Get a single leave type by ID
    /// </summary>
    public async Task<LeaveTypeDto?> GetLeaveTypeByIdAsync(int id)
    {
        var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
        
        if (leaveType == null)
        {
            return null;
        }
        
        return new LeaveTypeDto
        {
            Id = leaveType.Id,
            Name = leaveType.Name,
            MaxDaysPerYear = leaveType.MaxDaysPerYear
        };
    }
    
    /// <summary>
    /// Create a new leave type
    /// Validates name uniqueness and creates leave balances for all existing users
    /// </summary>
    public async Task<(LeaveTypeDto? Result, string? Error)> CreateLeaveTypeAsync(CreateLeaveTypeDto request)
    {
        // Validate uniqueness of name
        var existingType = await _leaveTypeRepository.GetByNameAsync(request.Name);
        if (existingType != null)
        {
            return (null, $"Leave type with name '{request.Name}' already exists");
        }
        
        // Create the leave type
        var leaveType = new LeaveType
        {
            Name = request.Name.Trim(),
            MaxDaysPerYear = request.MaxDaysPerYear
        };
        
        var createdLeaveType = await _leaveTypeRepository.CreateAsync(leaveType);
        
        // Create leave balances for all existing users with the new leave type
        await _leaveTypeRepository.CreateLeaveBalancesForAllUsersAsync(
            createdLeaveType.Id, 
            createdLeaveType.MaxDaysPerYear
        );
        
        return (new LeaveTypeDto
        {
            Id = createdLeaveType.Id,
            Name = createdLeaveType.Name,
            MaxDaysPerYear = createdLeaveType.MaxDaysPerYear
        }, null);
    }
    
    /// <summary>
    /// Update a leave type's MaxDaysPerYear
    /// Adjusts all leave balances accordingly:
    /// - If limit increased → add difference to remaining days
    /// - If limit decreased → cap remaining days at new max
    /// </summary>
    public async Task<(LeaveTypeDto? Result, string? Error)> UpdateLeaveTypeAsync(int id, UpdateLeaveTypeDto request)
    {
        var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
        if (leaveType == null)
        {
            return (null, "Leave type not found");
        }
        
        var oldMaxDays = leaveType.MaxDaysPerYear;
        var newMaxDays = request.MaxDaysPerYear;
        
        // Update the leave type
        leaveType.MaxDaysPerYear = newMaxDays;
        await _leaveTypeRepository.UpdateAsync(leaveType);
        
        // Adjust all leave balances for this type
        if (oldMaxDays != newMaxDays)
        {
            var balances = await _leaveTypeRepository.GetAllBalancesByLeaveTypeIdAsync(id);
            
            foreach (var balance in balances)
            {
                if (newMaxDays > oldMaxDays)
                {
                    // Limit increased → add the difference
                    var difference = newMaxDays - oldMaxDays;
                    balance.RemainingDays += difference;
                }
                else
                {
                    // Limit decreased → cap remaining days at new max
                    if (balance.RemainingDays > newMaxDays)
                    {
                        balance.RemainingDays = newMaxDays;
                    }
                }
            }
            
            await _leaveTypeRepository.UpdateLeaveBalancesAsync(balances);
        }
        
        return (new LeaveTypeDto
        {
            Id = leaveType.Id,
            Name = leaveType.Name,
            MaxDaysPerYear = leaveType.MaxDaysPerYear
        }, null);
    }
    
    /// <summary>
    /// Delete a leave type
    /// Blocks deletion if leave requests exist to maintain data integrity
    /// </summary>
    public async Task<(bool Success, string? Error)> DeleteLeaveTypeAsync(int id)
    {
        var leaveType = await _leaveTypeRepository.GetByIdAsync(id);
        if (leaveType == null)
        {
            return (false, "Leave type not found");
        }
        
        // Check if any leave requests exist for this type
        var hasRequests = await _leaveTypeRepository.HasLeaveRequestsAsync(id);
        if (hasRequests)
        {
            return (false, "Cannot delete leave type with existing leave requests. Consider deactivating instead.");
        }
        
        // Delete the leave type (this will cascade to balances via FK or we handle manually)
        var deleted = await _leaveTypeRepository.DeleteAsync(id);
        
        return (deleted, deleted ? null : "Failed to delete leave type");
    }
}
