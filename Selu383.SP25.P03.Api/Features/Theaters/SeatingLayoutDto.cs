using System;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class SeatingLayoutDto
    {
        public int ShowtimeId { get; set; }
        public required string MovieTitle { get; set; }
        public DateTime StartTime { get; set; }
        public required string ScreenName { get; set; }
        public int TheaterId { get; set; }
        public required string TheaterName { get; set; }
        public decimal TicketPrice { get; set; }
        public Dictionary<string, List<SeatDto>> Rows { get; set; } = new();
    }
}