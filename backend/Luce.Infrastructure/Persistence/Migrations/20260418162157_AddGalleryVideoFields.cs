using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Luce.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryVideoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MediaType",
                table: "GalleryItems",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "image");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "GalleryItems",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "GalleryItems");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "GalleryItems");
        }
    }
}
