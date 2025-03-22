using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Reservations
{
    public class CreateReservationRequest
    {
        [Required]
        public int ShowtimeId { get; set; }
        
        [Required]
        public List<CreateTicketDto> Tickets { get; set; } = new List<CreateTicketDto>();
        
        // Optional - for direct payment
        public bool ProcessPayment { get; set; } = false;
    }
}