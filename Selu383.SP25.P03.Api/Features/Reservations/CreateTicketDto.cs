using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Reservations
{
    public class CreateTicketDto
    {
        [Required]
        public int SeatId { get; set; }
        
        [Required]
        public string TicketType { get; set; } = "Adult"; 
        
        public decimal Price { get; set; } 
    }
}