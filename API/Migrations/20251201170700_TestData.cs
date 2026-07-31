using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class TestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "CreatedAt", "Location", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 11, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sıra1", "Mustafa" },
                    { 2, new DateTime(2023, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sıra2", "Enes" },
                    { 3, new DateTime(2023, 11, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sıra3", "Emir" },
                    { 4, new DateTime(2023, 11, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sıra4", "Batuhan" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Rooms",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
