using System;
using System.Collections.Generic;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Showtime
    {
    public int Id { get; set; }
    
    public DateTime StartTime { get; set; }
    
    public decimal TicketPrice { get; set; }
    
    public int MovieId { get; set; }
    
    public int ScreenId { get; set; }
    
    // Make navigation properties nullable
    public virtual Movie? Movie { get; set; }
    
    public virtual Screen? Screen { get; set; }
    
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    
    }
}