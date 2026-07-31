using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("/api/[controller]")] //api/rooms
public class RoomsController:ControllerBase
{
    private readonly DataContext _context;
    public RoomsController(DataContext context)
    {
        _context = context;
        
    }


    [HttpGet]
    public async Task<IActionResult> GetRooms()
    {
        var rooms = await _context.Rooms.ToListAsync();
        return Ok(rooms);   
    }

    //api/rooms/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoom(int? id)
    {
        if(id == null)
        {
            return NotFound();
        }
        var room = await _context.Rooms.FindAsync(id);

        if(room == null)
        {
            return NotFound();
        }
        return Ok(room);
    }
    
}