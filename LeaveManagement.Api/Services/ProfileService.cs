using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Models;
using LeaveManagement.Api.Repositories;
using Microsoft.AspNetCore.Identity;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Profile service interface
/// </summary>
public interface IProfileService
{
    Task<ProfileDto?> GetProfileAsync(int userId);
    Task<PasswordChangeResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto request);
}

/// <summary>
/// Profile service implementation
/// Handles user profile operations
/// </summary>
public class ProfileService : IProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHasher<User> _passwordHasher;
    
    public ProfileService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        _passwordHasher = new PasswordHasher<User>();
    }
    
    /// <summary>
    /// Get user profile by ID
    /// </summary>
    public async Task<ProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            return null;
        }
        
        return new ProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
    
    /// <summary>
    /// Change user password
    /// Validates current password and updates to new password
    /// </summary>
    public async Task<PasswordChangeResponseDto> ChangePasswordAsync(int userId, ChangePasswordDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            return new PasswordChangeResponseDto
            {
                Success = false,
                Message = "User not found"
            };
        }
        
        // Validate new password confirmation
        if (request.NewPassword != request.ConfirmNewPassword)
        {
            return new PasswordChangeResponseDto
            {
                Success = false,
                Message = "New passwords do not match"
            };
        }
        
        // Validate new password length
        if (request.NewPassword.Length < 6)
        {
            return new PasswordChangeResponseDto
            {
                Success = false,
                Message = "New password must be at least 6 characters"
            };
        }
        
        // Verify current password
        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return new PasswordChangeResponseDto
            {
                Success = false,
                Message = "Current password is incorrect"
            };
        }
        
        // Hash new password
        user.PasswordHash = _passwordHasher.HashPassword(user, request.NewPassword);
        
        // Update user
        await _userRepository.UpdateAsync(user);
        
        return new PasswordChangeResponseDto
        {
            Success = true,
            Message = "Password changed successfully"
        };
    }
}
