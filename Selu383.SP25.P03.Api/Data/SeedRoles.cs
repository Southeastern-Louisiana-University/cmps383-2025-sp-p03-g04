using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedRoles
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any roles.
                if (context.Roles.Any())
                {
                    return;   // DB has been seeded
                }
                var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
                
                // Add all roles
                await roleManager.CreateAsync(new Role { Name = UserRoleNames.Admin });  // Manager role
                await roleManager.CreateAsync(new Role { Name = UserRoleNames.Staff });  // Staff role
                await roleManager.CreateAsync(new Role { Name = UserRoleNames.User });   // Customer role
                
                context.SaveChanges();
            }
        }
    }
}