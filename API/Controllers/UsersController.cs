using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public UsersController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    // GET: /api/users
    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.UserName)
            .ToListAsync();

        var result = new List<object>();

        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);

            result.Add(new
            {
                id = u.Id,
                name = u.Name,
                userName = u.UserName,
                email = u.Email,
                roles = roles
            });
        }

        return Ok(result);
    }
}
