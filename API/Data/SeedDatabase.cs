using API.Entity;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public static class SeedDatabase
{
    public static async void Initialize(IApplicationBuilder app)
    {
        var userManager = app.ApplicationServices
                            .CreateScope()
                            .ServiceProvider
                            .GetRequiredService<UserManager<User>>();

        var roleManager = app.ApplicationServices
                            .CreateScope()
                            .ServiceProvider
                            .GetRequiredService<RoleManager<Role>>();

        if (!roleManager.Roles.Any())
        {
            var student = new Role { Name = "Student" };
            var admin = new Role { Name = "Admin" };

            await roleManager.CreateAsync(student);
            await roleManager.CreateAsync(admin);
        }

        if (!userManager.Users.Any())
        {
            var student = new User { Name = "Kuzey Kurtulan", UserName = "kuzeykurtulab", Email = "kuzeykurtulan@gmail.com" };
            var admin = new User { Name = "Mustafa Kurtulan", UserName = "mustafakurtulan", Email = "mustafakurtulan@gmail.com" };

            await userManager.CreateAsync(student, "Student_123");
            await userManager.AddToRoleAsync(student, "Student");

            await userManager.CreateAsync(admin, "Admin_123");
            await userManager.AddToRolesAsync(admin, ["Admin", "Student"]);
        }
    }
}