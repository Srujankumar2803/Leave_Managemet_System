using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.Api.Models;

// In a clean backend architecture, Models represent database entities,
// DTOs define the data that comes into and goes out of the API, 
//the Data layer (DbContext) maps models to database tables and defines 
//constraints while migrations handle actual table creation, the Repository 
//layer abstracts database access and exposes safe data operations, the Service layer
// contains business logic using repositories, and finally Controllers act as entry points 
//that receive requests, call services, and return responses.
//
/// Models represent how data is stored inside the system (database entities) 
/// and may contain sensitive or internal fields like IDs, roles, and password hashes, 
/// so they should never be exposed directly. DTOs (Data Transfer Objects) define how data
///  enters and leaves the application through APIs, containing only the fields needed for
///  a specific request or response, ensuring security, validation, and a clean contract 
/// between backend and frontend.
public class User
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "EMPLOYEE"; // EMPLOYEE | MANAGER | ADMIN
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
