using LeaveManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Api.Data;

/// <summary>
/// Database initializer for seeding initial data
/// </summary>
public static class DbInitializer
{
    public static async Task SeedData(ApplicationDbContext context)
    {
        // Check if leave types already exist
        if (await context.LeaveTypes.AnyAsync())
        {
            return; // Database already seeded
        }

        // Seed Leave Types
        var leaveTypes = new List<LeaveType>
        {
            new LeaveType { Name = "Casual Leave", MaxDaysPerYear = 12 },
            new LeaveType { Name = "Sick Leave", MaxDaysPerYear = 10 },
            new LeaveType { Name = "Earned Leave", MaxDaysPerYear = 15 }
        };

        await context.LeaveTypes.AddRangeAsync(leaveTypes);
        await context.SaveChangesAsync();

        // Get all existing users
        var users = await context.Users.ToListAsync();

        // Create leave balances for all users
        foreach (var user in users)
        {
            foreach (var leaveType in leaveTypes)
            {
                context.LeaveBalances.Add(new LeaveBalance
                {
                    UserId = user.Id,
                    LeaveTypeId = leaveType.Id,
                    RemainingDays = leaveType.MaxDaysPerYear
                });
            }
        }

        await context.SaveChangesAsync();
    }
}
