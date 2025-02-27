using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bulihub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class Szervezo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrganizerName",
                table: "Events",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrganizerName",
                table: "Events");
        }
    }
}
