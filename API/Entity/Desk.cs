using Microsoft.AspNetCore.Identity;

namespace API.Entity;

public class Desk
{
    public int Id { get; set; }
    public int RoomId { get; set; }

    public string DeskNumber { get; set; } = default!;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Room Room { get; set; } = default!;

    // ✅ Owner (Identity)
    public string CreatedByUserId { get; set; } = default!;
    public User CreatedByUser { get; set; } = default!;
}
