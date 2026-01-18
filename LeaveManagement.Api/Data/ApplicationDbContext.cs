using LeaveManagement.Api.Models; // as already told models are used for database entities, and this file is for database context
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Data;

// In a clean backend architecture, Models represent database entities,
// DTOs define the data that comes into and goes out of the API, 
//the Data layer (DbContext) maps models to database tables and defines 
//constraints while migrations handle actual table creation, the Repository 
//layer abstracts database access and exposes safe data operations, the Service layer
// contains business logic using repositories, and finally Controllers act as entry points 
//that receive requests, call services, and return responses.

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure User entity
        modelBuilder.Entity<User>(entity => // using User model we are mapping to database table called Users
        {
            // Email must be unique
            entity.HasIndex(e => e.Email).IsUnique();
            
            // Configure table name
            entity.ToTable("Users"); // maps model to "Users" table
        });
    }
}
