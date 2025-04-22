using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Auth;

public static class RoleInitializer
{
    public static async Task CreateRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roleNames = { "Administrator", "Student", "Teacher" };
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var config = serviceProvider.GetRequiredService<IConfiguration>();

        var email = config["AdminAccount:Email"]
            ?? throw new ArgumentNullException("AdminAccount:Email");

        var password = config["AdminAccount:Password"]
            ?? throw new ArgumentNullException("AdminAccount:Password");

        var adminUser = await userManager.FindByEmailAsync(email);

        if (adminUser == null)
        {
            var newAdmin = new User
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                LockoutEnabled = false
            };

            var result = await userManager.CreateAsync(newAdmin, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newAdmin, "Administrator");
            }
        }
    }
}