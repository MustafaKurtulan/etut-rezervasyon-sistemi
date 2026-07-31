using Microsoft.AspNetCore.Identity;

namespace API.Entity;

public class User: IdentityUser
{
    public string? Name { get; set; }
}