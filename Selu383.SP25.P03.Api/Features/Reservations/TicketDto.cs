namespace Selu383.SP25.P03.Api.Features.Reservations
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int SeatId { get; set; }
        public required string Row { get; set; }
        public int Number { get; set; }
        public required string TicketType { get; set; }
        public decimal Price { get; set; }
    }
}