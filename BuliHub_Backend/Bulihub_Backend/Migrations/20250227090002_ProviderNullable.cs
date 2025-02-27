using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bulihub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ProviderNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_ServiceProviders_ProviderId",
                table: "Events");

            migrationBuilder.AlterColumn<int>(
                name: "ProviderId",
                table: "Events",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_ServiceProviders_ProviderId",
                table: "Events",
                column: "ProviderId",
                principalTable: "ServiceProviders",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_ServiceProviders_ProviderId",
                table: "Events");

            migrationBuilder.AlterColumn<int>(
                name: "ProviderId",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_ServiceProviders_ProviderId",
                table: "Events",
                column: "ProviderId",
                principalTable: "ServiceProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
