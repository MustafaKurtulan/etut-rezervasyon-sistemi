using System.ComponentModel.DataAnnotations;

namespace API.Entity;

public class Room
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string? Name { get; set; }
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

}