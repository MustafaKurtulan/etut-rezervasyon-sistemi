using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeskController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public DeskController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<List<DeskDTO>>> GetDesks()
    {
        var desks = await _context.Desks
            .Include(d => d.Room) // Desk ile ilişkili Room verisini de getir
            .Include(d => d.CreatedByUser)
            .OrderBy(d => d.Id)
            .Select(d => new DeskDTO
            {
                Id = d.Id,
                RoomId = d.RoomId,
                DeskNumber = d.DeskNumber,
                IsActive = d.IsActive,
                CreatedAt = d.CreatedAt,

                RoomName = d.Room.Name,
                RoomLocation = d.Room.Location,

                CreatedByUserId = d.CreatedByUserId,
                CreatedByUsername = d.CreatedByUser.UserName
            })
            .ToListAsync();

        return Ok(desks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DeskDTO>> GetDesk(int id)
    {
        var d = await _context.Desks
            .Include(x => x.Room)
            .Include(x => x.CreatedByUser)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (d == null) return NotFound();

        return Ok(new DeskDTO
        {
            Id = d.Id,
            RoomId = d.RoomId,
            DeskNumber = d.DeskNumber,
            IsActive = d.IsActive,
            CreatedAt = d.CreatedAt,
            RoomName = d.Room.Name,
            RoomLocation = d.Room.Location,
            CreatedByUserId = d.CreatedByUserId,
            CreatedByUsername = d.CreatedByUser.UserName
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<DeskDTO>> CreateDesk(DeskDTO model)
    {
        if (model.RoomId < 1 || model.RoomId > 4) return BadRequest("RoomId 1-4 olmalı.");
        if (!int.TryParse(model.DeskNumber, out var dn) || dn < 1 || dn > 100) // DeskNumber string int e çevrilemiyorsa veya 1-100 dışındaysa 400
            return BadRequest("DeskNumber 1-100 olmalı.");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // JWT içindeki NameIdentifier user id claim ini alır
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var exists = await _context.Desks.AnyAsync(d => d.RoomId == model.RoomId && d.DeskNumber == model.DeskNumber);
        if (exists) return BadRequest("Bu RoomId içinde bu DeskNumber zaten var."); // Aynı room içinde aynı masa numarası var mı? (unique kontrol)

        var desk = new Desk
        {
            RoomId = model.RoomId,
            DeskNumber = model.DeskNumber,
            IsActive = model.IsActive,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = userId
        };

        _context.Desks.Add(desk);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("Bu RoomId içinde bu DeskNumber zaten var.");
        }

        var createdBy = await _userManager.FindByIdAsync(userId);

        var dto = new DeskDTO
        {
            Id = desk.Id,
            RoomId = desk.RoomId,
            DeskNumber = desk.DeskNumber,
            IsActive = desk.IsActive,
            CreatedAt = desk.CreatedAt,
            CreatedByUserId = desk.CreatedByUserId,
            CreatedByUsername = createdBy?.UserName
        };

        return CreatedAtAction(nameof(GetDesk), new { id = desk.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateDesk(int id, DeskDTO model)
    {
        if (id != model.Id) return BadRequest("Id uyuşmuyor");

        if (model.RoomId < 1 || model.RoomId > 4) return BadRequest("RoomId 1-4 olmalı.");
        if (!int.TryParse(model.DeskNumber, out var dn) || dn < 1 || dn > 100)
            return BadRequest("DeskNumber 1-100 olmalı.");

        var desk = await _context.Desks.FirstOrDefaultAsync(d => d.Id == id);
        if (desk == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        var isOwner = desk.CreatedByUserId == userId;
        if (!isAdmin && !isOwner) return Forbid();

        // aynı room içinde aynı deskNumber var mı? (kendi haric)
        var exists = await _context.Desks.AnyAsync(d =>
            d.Id != id && d.RoomId == model.RoomId && d.DeskNumber == model.DeskNumber);
        if (exists) return BadRequest("Bu RoomId içinde bu DeskNumber zaten var.");

        desk.RoomId = model.RoomId;
        desk.DeskNumber = model.DeskNumber;
        desk.IsActive = model.IsActive;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("Bu RoomId içinde bu DeskNumber zaten var.");
        }

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDesk(int id)
    {
        var desk = await _context.Desks.FirstOrDefaultAsync(d => d.Id == id);
        if (desk == null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        var isOwner = desk.CreatedByUserId == userId;
        if (!isAdmin && !isOwner) return Forbid();

        _context.Desks.Remove(desk);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
