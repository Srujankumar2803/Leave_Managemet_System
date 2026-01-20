using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Repositories;

namespace LeaveManagement.Api.Services;

/// <summary>
/// Admin service interface for user management operations
/// </summary>
public interface IAdminService
{
    Task<List<UserListDto>> GetAllUsersAsync();
    Task<bool> UpdateUserRoleAsync(int userId, string newRole);
}

/// <summary>
/// Admin service implementation
/// Handles admin-specific operations like user management
/// </summary>
public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;
    
    public AdminService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    /// <summary>
    /// Get all users for admin dashboard
    /// Returns user list without sensitive data
    /// </summary>
    public async Task<List<UserListDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        
        return users.Select(u => new UserListDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role
        }).ToList();
    }
    
    /// <summary>
    /// Update user role (admin only)
    /// Validates role and updates database
    /// </summary>
    public async Task<bool> UpdateUserRoleAsync(int userId, string newRole)
    {
        // Validate role
        var validRoles = new[] { "EMPLOYEE", "MANAGER", "ADMIN" };
        if (!validRoles.Contains(newRole.ToUpper()))
        {
            return false;
        }
        
        // Get user
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }
        
        // Update role
        user.Role = newRole.ToUpper();
        await _userRepository.UpdateAsync(user);
        
        return true;
    }
}
