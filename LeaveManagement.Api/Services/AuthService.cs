using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LeaveManagement.Api.Dtos;
using LeaveManagement.Api.Models;
using LeaveManagement.Api.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace LeaveManagement.Api.Services;

// ✔ DTOs handle input/output
// ✔ Models represent database entities
// ✔ Service converts DTO → Model → DTO
// ✔ Repository handles DB access
// ✔ Controller stays thin

// In a clean backend architecture, Models represent database entities,
// DTOs define the data that comes into and goes out of the API, 
//the Data layer (DbContext) maps models to database tables and defines 
//constraints while migrations handle actual table creation, the Repository 
//layer abstracts database access and exposes safe data operations, the Service layer
// contains business logic using repositories, and finally Controllers act as entry points 
//that receive requests, call services, and return responses.
public interface IAuthService
{
    Task<AuthResponseDto?> RegisterUserAsync(RegisterRequestDto request);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
}

/// <summary>
/// Authentication service - handles business logic for authentication
/// Contains: user registration, login, JWT generation
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;
    
    public AuthService(
        IUserRepository userRepository, 
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }
    
    /// <summary>
    /// Register a new user
    /// Hashes password and saves user with default EMPLOYEE role
    /// </summary>
    public async Task<AuthResponseDto?> RegisterUserAsync(RegisterRequestDto request)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email); // here these
        //  emails and all is coming from dtos and not from models since we know that models
        //  are there for database representation and dtos are for data transfer in and out 
        // of the application
        if (existingUser != null)
        {
            return null; // User already exists
        }
        
        // Create new user
        var user = new User // here this User is model not dto
        {
            Name = request.Name,
            Email = request.Email,
            Role = "EMPLOYEE" // Default role
        };
        
        // Hash password using built-in Identity PasswordHasher
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
        
        // Save to database
        var createdUser = await _userRepository.CreateAsync(user);
        
        // Generate JWT token
        var token = GenerateJwtToken(createdUser);
        
        return new AuthResponseDto
        {
            Token = token,
            UserId = createdUser.Id,
            Name = createdUser.Name,
            Email = createdUser.Email,
            Role = createdUser.Role
        };
    }
    
    /// <summary>
    /// Authenticate user and generate JWT
    /// Validates credentials and returns token if successful
    /// </summary>
    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        // Get user by email
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return null; // User not found
        }
        
        // Verify password
        var result = _passwordHasher.VerifyHashedPassword(
            user, 
            user.PasswordHash, 
            request.Password
        );
        
        if (result == PasswordVerificationResult.Failed)
        {
            return null; // Invalid password
        }
        
        // Generate JWT token
        var token = GenerateJwtToken(user);
        
        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }
    
    /// <summary>
    /// Generate JWT token with user claims
    /// Token contains UserId, Email, Name, and Role
    /// </summary>
    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);
        
        // Create claims - data stored in the token
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };
        
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key), 
            SecurityAlgorithms.HmacSha256
        );
        
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
