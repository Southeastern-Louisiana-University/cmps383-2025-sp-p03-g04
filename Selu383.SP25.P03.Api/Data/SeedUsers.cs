using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedUsers
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any users.
                if (context.Users.Any())
                {
                    return;   // DB has been seeded
                }
                var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

                // Admin/Manager users
                var manager = new User { UserName = "manager", Email = "manager@lionsden.com" };
                await userManager.CreateAsync(manager, "Password123!");
                await userManager.AddToRoleAsync(manager, UserRoleNames.Admin);

                // Staff users
                var staff1 = new User { UserName = "staff1", Email = "staff1@lionsden.com" };
                await userManager.CreateAsync(staff1, "Password123!");
                await userManager.AddToRoleAsync(staff1, UserRoleNames.User);

                var staff2 = new User { UserName = "staff2", Email = "staff2@lionsden.com" };
                await userManager.CreateAsync(staff2, "Password123!");
                await userManager.AddToRoleAsync(staff2, UserRoleNames.User);

                // Customer users
                var customer1 = new User { UserName = "customer1", Email = "customer1@example.com" };
                await userManager.CreateAsync(customer1, "Password123!");
                await userManager.AddToRoleAsync(customer1, UserRoleNames.User);

                var customer2 = new User { UserName = "customer2", Email = "customer2@example.com" };
                await userManager.CreateAsync(customer2, "Password123!");
                await userManager.AddToRoleAsync(customer2, UserRoleNames.User);

                // Keep existing users with updated roles
                var galkadi = new User { UserName = "galkadi", Email = "galkadi@example.com" };
                await userManager.CreateAsync(galkadi, "Password123!");
                await userManager.AddToRoleAsync(galkadi, UserRoleNames.Admin);

                var bob = new User { UserName = "bob", Email = "bob@example.com" };
                await userManager.CreateAsync(bob, "Password123!");
                await userManager.AddToRoleAsync(bob, UserRoleNames.User);

                var sue = new User { UserName = "sue", Email = "sue@example.com" };
                await userManager.CreateAsync(sue, "Password123!");
                await userManager.AddToRoleAsync(sue, UserRoleNames.User);

                context.SaveChanges();
            }
        }
    }
}