using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Models;
using LeaveManagement.Api.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using LeaveManagement.Api.Data;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Leave service interface
/// </summary>
public interface ILeaveService
{
    Task<LeaveResponseDto> ApplyLeaveAsync(int userId, ApplyLeaveRequestDto request);
    Task<List<LeaveBalanceDto>> GetUserLeaveBalancesAsync(int userId);
    Task<List<LeaveResponseDto>> GetUserLeaveRequestsAsync(int userId);
}

/// <summary>
/// Leave service implementation
/// Contains all business logic for leave management
/// </summary>
public class LeaveService : ILeaveService
{
    private readonly ILeaveRepository _leaveRepository;
    private readonly ApplicationDbContext _context;
    
    public LeaveService(ILeaveRepository leaveRepository, ApplicationDbContext context)
    {
        _leaveRepository = leaveRepository;
        _context = context;
    }
    
    /// <summary>
    /// Apply for leave with business rule validations
    /// Uses database transaction for data integrity
    /// </summary>
    public async Task<LeaveResponseDto> ApplyLeaveAsync(int userId, ApplyLeaveRequestDto request)
    {
        // Start database transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            // Business Rule 1: Validate date range
            if (request.StartDate > request.EndDate)
            {
                throw new InvalidOperationException("Start date must be before or equal to end date");
            }
            
            // Business Rule 2: Validate leave type exists
            var leaveType = await _leaveRepository.GetLeaveTypeByIdAsync(request.LeaveTypeId);
            if (leaveType == null)
            {
                throw new InvalidOperationException("Invalid leave type");
            }
            
            // Calculate total days (inclusive)
            var totalDays = CalculateTotalDays(request.StartDate, request.EndDate);
            
            // Business Rule 3: Check leave balance
            var leaveBalance = await _leaveRepository.GetLeaveBalanceAsync(userId, request.LeaveTypeId);
            if (leaveBalance == null)
            {
                throw new InvalidOperationException("Leave balance not found for this leave type");
            }
            
            if (leaveBalance.RemainingDays < totalDays)
            {
                throw new InvalidOperationException(
                    $"Insufficient leave balance. Available: {leaveBalance.RemainingDays} days, Requested: {totalDays} days"
                );
            }
            
            // Business Rule 4: Check for overlapping leave requests
            var hasOverlap = await _leaveRepository.HasOverlappingLeaveAsync(
                userId, 
                request.StartDate, 
                request.EndDate
            );
            
            if (hasOverlap)
            {
                throw new InvalidOperationException("You already have a leave request for overlapping dates");
            }
            
            // Create leave request
            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                LeaveTypeId = request.LeaveTypeId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalDays = totalDays,
                Reason = request.Reason,
                Status = "PENDING",
                AppliedAt = DateTime.UtcNow
            };
            
            var createdRequest = await _leaveRepository.CreateLeaveRequestAsync(leaveRequest);
            
            // Deduct leave balance
            leaveBalance.RemainingDays -= totalDays;
            await _leaveRepository.UpdateLeaveBalanceAsync(leaveBalance);
            
            // Commit transaction
            await transaction.CommitAsync();
            
            // Return response DTO
            return new LeaveResponseDto
            {
                Id = createdRequest.Id,
                UserId = createdRequest.UserId,
                UserName = createdRequest.User.Name,
                LeaveTypeId = createdRequest.LeaveTypeId,
                LeaveTypeName = createdRequest.LeaveType.Name,
                StartDate = createdRequest.StartDate,
                EndDate = createdRequest.EndDate,
                TotalDays = createdRequest.TotalDays,
                Reason = createdRequest.Reason,
                Status = createdRequest.Status,
                AppliedAt = createdRequest.AppliedAt
            };
        }
        catch
        {
            // Rollback transaction on any error
            await transaction.RollbackAsync();
            throw;
        }
    }
    
    /// <summary>
    /// Get user's leave balances for all leave types
    /// </summary>
    public async Task<List<LeaveBalanceDto>> GetUserLeaveBalancesAsync(int userId)
    {
        // This would typically fetch from database
        // For now, returning empty list - will be implemented when we add balance initialization
        return new List<LeaveBalanceDto>();
    }
    
    /// <summary>
    /// Get all leave requests for a user
    /// </summary>
    public async Task<List<LeaveResponseDto>> GetUserLeaveRequestsAsync(int userId)
    {
        var requests = await _leaveRepository.GetUserLeaveRequestsAsync(userId);
        
        return requests.Select(lr => new LeaveResponseDto
        {
            Id = lr.Id,
            UserId = lr.UserId,
            UserName = lr.User.Name,
            LeaveTypeId = lr.LeaveTypeId,
            LeaveTypeName = lr.LeaveType.Name,
            StartDate = lr.StartDate,
            EndDate = lr.EndDate,
            TotalDays = lr.TotalDays,
            Reason = lr.Reason,
            Status = lr.Status,
            AppliedAt = lr.AppliedAt
        }).ToList();
    }
    
    /// <summary>
    /// Calculate total days between start and end date (inclusive)
    /// </summary>
    private int CalculateTotalDays(DateTime startDate, DateTime endDate)
    {
        return (endDate.Date - startDate.Date).Days + 1;
    }
}
