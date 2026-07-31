using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService
{
    private readonly UserManager<User> _userManeger;
    private readonly IConfiguration _config;

    public TokenService(UserManager<User> userManeger, IConfiguration config)
    {
        _userManeger = userManeger;
        _config = config;
    }

    public async Task<string> GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(ClaimTypes.Name, user.UserName!)
        };

        var roles = await _userManeger.GetRolesAsync(user);

        foreach(var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenHandler = new JwtSecurityTokenHandler ();
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["JWTSecurity:SecretKey"]!));

        var tokenSettings = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(30),
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
            Issuer = "mustafakurtulan.com",
            Audience = "abc"
        };

        var token = tokenHandler.CreateToken(tokenSettings);
        return tokenHandler.WriteToken(token);
    }
}