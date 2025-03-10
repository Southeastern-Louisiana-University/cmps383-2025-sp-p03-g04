using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class Movie
    {
    public int Id { get; set; }
    
    [Required]
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public string? PosterUrl { get; set; }
    
    public int Runtime { get; set; }
    
    public string? Rating { get; set; }
    
    public DateTime ReleaseDate { get; set; }
    
    public int? TmdbId { get; set; }
    
    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
    }
}