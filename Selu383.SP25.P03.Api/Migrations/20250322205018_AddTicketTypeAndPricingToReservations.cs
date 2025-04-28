using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    
    public partial class AddTicketTypeAndPricingToReservations : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "ReservationSeats",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TicketType",
                table: "ReservationSeats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "ReservationSeats");

            migrationBuilder.DropColumn(
                name: "TicketType",
                table: "ReservationSeats");
        }
    }
}
