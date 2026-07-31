using API.DTO;
using API.Entity;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController] // Bu sınıfın bir Web API controller olduğunu belirtir
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager; //kullanıcı oluşturma şifri vs gibi her şeyi yapan sınıf identity den gelir
    private readonly TokenService _tokenService;

    public AccountController(UserManager<User> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO model) // Task = Henüz bitmemiş iş, ActionResult = HTTP response
    {
        var user = await _userManager.FindByNameAsync(model.UserName); //usermanager tablosundan ismi bul
        if (user == null) return BadRequest(new ProblemDetails { Title = "username hatalı" });

        var ok = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!ok) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserDTO
        {
            Name = user.Name!,
            Token = await _tokenService.GenerateToken(user),
            Roles = roles.ToList()
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> CreateUser(RegisterDTO model)
    {
        if (!ModelState.IsValid) //validasyon kurlların sorgu
        {
            return BadRequest(ModelState);
        }

        var user = new User
        {
            Name = model.Name,
            UserName = model.UserName,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "Student");
            return StatusCode(201);
        }

        return BadRequest(result.Errors);
    }

[Authorize]
[HttpGet("getuser")]
public async Task<ActionResult<UserDTO>> GetUser()
{
    var user = await _userManager.FindByNameAsync(User.Identity!.Name!);
    if (user == null) return BadRequest(new ProblemDetails { Title = "username ya da parola hatalı" });

    var roles = await _userManager.GetRolesAsync(user);

    return Ok(new UserDTO
    {
        Name = user.Name!,
        Token = await _tokenService.GenerateToken(user),
        Roles = roles.ToList()
    });
    }
}