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
