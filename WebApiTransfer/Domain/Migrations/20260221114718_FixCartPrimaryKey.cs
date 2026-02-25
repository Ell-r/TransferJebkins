using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Domain.Migrations
{
    /// <inheritdoc />
    public partial class FixCartPrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblCarts",
                table: "tblCarts");

            migrationBuilder.DropIndex(
                name: "IX_tblCarts_UserId",
                table: "tblCarts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblCarts",
                table: "tblCarts",
                columns: new[] { "UserId", "TransportationId" });

            migrationBuilder.CreateIndex(
                name: "IX_tblCarts_TransportationId",
                table: "tblCarts",
                column: "TransportationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblCarts",
                table: "tblCarts");

            migrationBuilder.DropIndex(
                name: "IX_tblCarts_TransportationId",
                table: "tblCarts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblCarts",
                table: "tblCarts",
                columns: new[] { "TransportationId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_tblCarts_UserId",
                table: "tblCarts",
                column: "UserId");
        }
    }
}
