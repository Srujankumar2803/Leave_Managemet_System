using LeaveManagement.Api.Data;
using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Repositories;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Manager service interface
/// </summary>
public interface IManagerService
{
    Task<List<PendingLeaveDto>> GetPendingLeavesAsync();
    Task<ApprovalResponseDto> ApproveLeaveAsync(int leaveId);
    Task<ApprovalResponseDto> RejectLeaveAsync(int leaveId);
}

/// <summary>
/// Manager service implementation
/// Handles leave approval/rejection workflow
/// </summary>
public class ManagerService : IManagerService
{
    private readonly ILeaveRepository _leaveRepository;
    private readonly ApplicationDbContext _context;
    
    public ManagerService(ILeaveRepository leaveRepository, ApplicationDbContext context)
    {
        _leaveRepository = leaveRepository;
        _context = context;
    }
    
    /// <summary>
    /// Get all pending leave requests
    /// </summary>
    public async Task<List<PendingLeaveDto>> GetPendingLeavesAsync()
    {
        var pendingLeaves = await _leaveRepository.GetPendingLeaveRequestsAsync();
        
        return pendingLeaves.Select(lr => new PendingLeaveDto
        {
            Id = lr.Id,
            UserId = lr.UserId,
            EmployeeName = lr.User.Name,
            EmployeeEmail = lr.User.Email,
            LeaveTypeId = lr.LeaveTypeId,
            LeaveTypeName = lr.LeaveType.Name,
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            TotalDays = lr.TotalDays,
            Reason = lr.Reason,
            AppliedAt = lr.AppliedAt
        }).ToList();
    }
    
    /// <summary>
    /// Approve leave request
    /// No balance adjustment needed (already deducted when applied)
    /// </summary>
    public async Task<ApprovalResponseDto> ApproveLeaveAsync(int leaveId)
    {
        var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(leaveId);
        
        if (leaveRequest == null)
        {
            throw new KeyNotFoundException("Leave request not found");
        }
        
        if (leaveRequest.Status != "PENDING")
        {
            throw new InvalidOperationException($"Cannot approve leave with status: {leaveRequest.Status}");
        }
        
        // Update status to APPROVED
        leaveRequest.Status = "APPROVED";
        await _leaveRepository.UpdateLeaveRequestAsync(leaveRequest);
        
        return new ApprovalResponseDto
        {
            LeaveId = leaveRequest.Id,
            Status = "APPROVED",
            Message = $"Leave request for {leaveRequest.User.Name} has been approved"
        };
    }
    
    /// <summary>
    /// Reject leave request and rollback leave balance
    /// Uses transaction to ensure data consistency
    /// </summary>
    public async Task<ApprovalResponseDto> RejectLeaveAsync(int leaveId)
    {
        // Start database transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(leaveId);
            
            if (leaveRequest == null)
            {
                throw new KeyNotFoundException("Leave request not found");
            }
            
            if (leaveRequest.Status != "PENDING")
            {
                throw new InvalidOperationException($"Cannot reject leave with status: {leaveRequest.Status}");
            }
            
            // Update status to REJECTED
            leaveRequest.Status = "REJECTED";
            await _leaveRepository.UpdateLeaveRequestAsync(leaveRequest);
            
            // Rollback leave balance (add days back)
            var leaveBalance = await _leaveRepository.GetLeaveBalanceAsync(
                leaveRequest.UserId, 
                leaveRequest.LeaveTypeId
            );
            
            if (leaveBalance != null)
            {
                leaveBalance.RemainingDays += leaveRequest.TotalDays;
                await _leaveRepository.UpdateLeaveBalanceAsync(leaveBalance);
            }
            
            // Commit transaction
            await transaction.CommitAsync();
            
            return new ApprovalResponseDto
            {
                LeaveId = leaveRequest.Id,
                Status = "REJECTED",
                Message = $"Leave request for {leaveRequest.User.Name} has been rejected and balance restored"
            };
        }
        catch
        {
            // Rollback transaction on any error
            await transaction.RollbackAsync();
            throw;
        }
    }
}
