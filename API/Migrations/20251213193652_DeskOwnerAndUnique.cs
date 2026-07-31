using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DeskOwnerAndUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Desks_RoomId",
                table: "Desks");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Desks",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Desks_CreatedByUserId",
                table: "Desks",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Desks_RoomId_DeskNumber",
                table: "Desks",
                columns: new[] { "RoomId", "DeskNumber" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Desks_AspNetUsers_CreatedByUserId",
                table: "Desks",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Desks_AspNetUsers_CreatedByUserId",
                table: "Desks");

            migrationBuilder.DropIndex(
                name: "IX_Desks_CreatedByUserId",
                table: "Desks");

            migrationBuilder.DropIndex(
                name: "IX_Desks_RoomId_DeskNumber",
                table: "Desks");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Desks");

            migrationBuilder.CreateIndex(
                name: "IX_Desks_RoomId",
                table: "Desks",
                column: "RoomId");
        }
    }
}
