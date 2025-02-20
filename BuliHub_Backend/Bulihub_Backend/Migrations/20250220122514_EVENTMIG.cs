using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bulihub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class EVENTMIG : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Guests",
                table: "Events",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationName",
                table: "Events",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Theme",
                table: "Events",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Guests",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "LocationName",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Events");
        }
    }
}
