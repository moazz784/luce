using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Luce.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryMediaTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MediaTitle",
                table: "GalleryItems",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaTitle",
                table: "GalleryItems");
        }
    }
}
