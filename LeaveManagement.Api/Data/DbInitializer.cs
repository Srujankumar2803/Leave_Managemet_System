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
        // Seed System Settings first
        await SeedSystemSettings(context);
        
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
    
    /// <summary>
    /// Seed default system settings if they don't exist
    /// </summary>
    private static async Task SeedSystemSettings(ApplicationDbContext context)
    {
        // Check if system settings already exist
        if (await context.SystemSettings.AnyAsync())
        {
            return; // Settings already seeded
        }
        
        // Default system settings
        var defaultSettings = new List<SystemSetting>
        {
            new SystemSetting 
            { 
                Key = SystemSettingKeys.CompanyName, 
                Value = "My Company" 
            },
            new SystemSetting 
            { 
                Key = SystemSettingKeys.LeaveYearStartMonth, 
                Value = "January" 
            },
            new SystemSetting 
            { 
                Key = SystemSettingKeys.MaxCarryForwardDays, 
                Value = "5" 
            }
        };
        
        await context.SystemSettings.AddRangeAsync(defaultSettings);
        await context.SaveChangesAsync();
    }
}
