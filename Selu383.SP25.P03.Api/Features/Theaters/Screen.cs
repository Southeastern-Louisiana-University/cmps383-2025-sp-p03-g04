using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Screen
    {
    public int Id { get; set; }
    
    [Required]
    public required string Name { get; set; }
    
    public int Capacity { get; set; }
    
    public int TheaterId { get; set; }
    
    public virtual Theater? Theater { get; set; }
    
    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    }
}