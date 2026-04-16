using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Luce.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "NewsItems",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "NewsItems");
        }
    }
}
