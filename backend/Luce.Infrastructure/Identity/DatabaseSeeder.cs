using Luce.Infrastructure.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Luce.Infrastructure.Identity;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var seed = services.GetRequiredService<IOptions<SeedOptions>>().Value;

        const string adminRole = "Admin";
        if (!await roleManager.RoleExistsAsync(adminRole))
            await roleManager.CreateAsync(new IdentityRole(adminRole));

        var existing = await userManager.FindByEmailAsync(seed.AdminEmail);
        if (existing is not null)
            return;

        var user = new ApplicationUser
        {
            UserName = seed.AdminEmail,
            Email = seed.AdminEmail,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, seed.AdminPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException("Failed to seed admin: " + string.Join("; ", result.Errors.Select(e => e.Description)));

        await userManager.AddToRoleAsync(user, adminRole);
    }
}
