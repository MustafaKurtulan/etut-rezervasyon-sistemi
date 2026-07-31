namespace API.DTO;

public class DeskDTO
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public string DeskNumber { get; set; } = default!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? RoomName { get; set; }
    public string? RoomLocation { get; set; }

    // ✅ Owner info (frontend için)
    public string? CreatedByUserId { get; set; }
    public string? CreatedByUsername { get; set; }
}
