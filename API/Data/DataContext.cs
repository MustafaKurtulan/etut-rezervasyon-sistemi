using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<User, Role, string>
(options)
{
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Desk> Desks => Set<Desk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    //Aynı room içinde aynı deskNumber olmasın
    modelBuilder.Entity<Desk>()
        .HasIndex(d => new { d.RoomId, d.DeskNumber })
        .IsUnique();

    modelBuilder.Entity<Desk>()
        .HasOne(d => d.CreatedByUser)
        .WithMany()
        .HasForeignKey(d => d.CreatedByUserId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Room>().HasData(
        new List<Room>
        {
            new Room { Id=1, Name="Kutuphane1", Location="Kampüs", CreatedAt=new DateTime(2023, 11, 22) },
            new Room { Id=2, Name="Kutuphane2", Location="Kampüs", CreatedAt=new DateTime(2023, 11, 23) },
            new Room { Id=3, Name="Kutuphane3", Location="Kampüs", CreatedAt=new DateTime(2023, 11, 24) },
            new Room { Id=4, Name="Kutuphane4", Location="Kampüs", CreatedAt=new DateTime(2023, 11, 25) },
        }
    );
}
}