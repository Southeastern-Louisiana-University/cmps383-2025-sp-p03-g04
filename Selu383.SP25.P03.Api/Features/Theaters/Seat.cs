using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Seat
{
    public int Id { get; set; }
    
    [Required]
    public required string Row { get; set; }
    
    public int Number { get; set; }
    
    public int ScreenId { get; set; }
    
    
    public virtual Screen? Screen { get; set; }
    
    
    public virtual ICollection<ReservationSeat> ReservationSeats { get; set; } = new List<ReservationSeat>();
}
}