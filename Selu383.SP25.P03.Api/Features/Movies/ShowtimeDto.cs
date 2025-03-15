using System;

namespace Selu383.SP25.P03.Api.Features.Movies
{
    public class ShowtimeDto
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public decimal TicketPrice { get; set; }
    public int MovieId { get; set; }
    public required string MovieTitle { get; set; }
    public int ScreenId { get; set; }
    public required string ScreenName { get; set; }
    public int TheaterId { get; set; }
    public required string TheaterName { get; set; }
}
}