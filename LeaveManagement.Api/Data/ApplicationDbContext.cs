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


// With EF Core migrations, the database schema is automatically generated and \
//updated by EF using the connection string, DbContext, and model classes, creating the database,
// tables, indexes, and constraints without writing SQL manually, whereas in manual 
//creation the developer must explicitly create the database, schemas, tables, indexes,
// and constraints in SSMS and keep them in sync with the code, which is error-prone 
//and hard to maintain; therefore, EF Core migrations are preferred for new applications 
//while manual creation is mainly used for legacy or DBA-controlled databases.

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }
    
    // User management
    public DbSet<User> Users { get; set; }
    
    // Leave management
    public DbSet<LeaveType> LeaveTypes { get; set; }
    public DbSet<LeaveBalance> LeaveBalances { get; set; }
    public DbSet<LeaveRequest> LeaveRequests { get; set; }
    
    // System settings
    public DbSet<SystemSetting> SystemSettings { get; set; }
    
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
        
        // Configure LeaveBalance entity - cascade delete when LeaveType is deleted
        modelBuilder.Entity<LeaveBalance>(entity =>
        {
            entity.HasOne(lb => lb.LeaveType)
                .WithMany()
                .HasForeignKey(lb => lb.LeaveTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        // Configure LeaveType entity - ensure unique name
        modelBuilder.Entity<LeaveType>(entity =>
        {
            entity.HasIndex(lt => lt.Name).IsUnique();
        });
        
        // Configure SystemSetting entity - ensure unique key
        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasIndex(s => s.Key).IsUnique();
            entity.ToTable("SystemSettings");
        });
    }
}
