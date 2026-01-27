namespace LeaveManagement.Api.Dtos;

/// <summary>
/// User profile data transfer object
/// </summary>
public class ProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Change password request DTO
/// </summary>
public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

/// <summary>
/// Password change response DTO
/// </summary>
public class PasswordChangeResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
