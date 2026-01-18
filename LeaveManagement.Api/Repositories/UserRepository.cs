using LeaveManagement.Api.Data;
using LeaveManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Repositories;

// In a clean backend architecture, Models represent database entities,
// DTOs define the data that comes into and goes out of the API, 
//the Data layer (DbContext) maps models to database tables and defines 
//constraints while migrations handle actual table creation, the Repository 
//layer abstracts database access and exposes safe data operations, the Service layer
// contains business logic using repositories, and finally Controllers act as entry points 
//that receive requests, call services, and return responses.
/// 
/// 
/// The UserRepository encapsulates all database operations related to the User entity, 
/// providing methods to retrieve a user by email and to create a new user, 
/// while hiding EF Core details from the rest of the application and keeping 
/// data access logic clean, reusable, and testable.
public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
}

/// <summary>
/// Repository implementation for User database operations
/// Handles all direct database access for User entity
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Get user by email address
    /// </summary>
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users // database.Users table
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    /// <summary>
    /// Create a new user in the database
    /// </summary>
    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user); // database.Users table
        await _context.SaveChangesAsync();
        return user;
    }
}
