using System;
using System.Collections.Generic;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Reservations
{
    public class Reservation
    {
    public int Id { get; set; }
    
    public DateTime ReservationTime { get; set; }
    
    public bool IsPaid { get; set; }
    
    public decimal TotalAmount { get; set; }
    
    public int? UserId { get; set; }
    
    public int ShowtimeId { get; set; }
    
    public virtual User? User { get; set; }
    
    public virtual Showtime? Showtime { get; set; }
    
    public virtual ICollection<ReservationSeat> ReservationSeats { get; set; } = new List<ReservationSeat>();
    
    }
}