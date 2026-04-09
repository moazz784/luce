using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Luce.Infrastructure.Persistence.Migrations;

/// <inheritdoc />
public partial class AddRegistrationOtp : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "RegistrationOtps",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                OtpHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                ExpiresAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                ConsumedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                PendingUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RegistrationOtps", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_RegistrationOtps_Email",
            table: "RegistrationOtps",
            column: "Email");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "RegistrationOtps");
    }
}
