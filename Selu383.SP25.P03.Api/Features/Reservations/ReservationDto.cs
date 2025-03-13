using System;
using System.Collections.Generic;

namespace Selu383.SP25.P03.Api.Features.Reservations
{
public class ReservationDto
{
    public int Id { get; set; }
    public DateTime ReservationTime { get; set; }
    public bool IsPaid { get; set; }
    public decimal TotalAmount { get; set; }
    public int? UserId { get; set; }
    public int ShowtimeId { get; set; }
    public DateTime ShowtimeStartTime { get; set; }
    public required string MovieTitle { get; set; }
    public required string TheaterName { get; set; }
    public required string ScreenName { get; set; }
    public List<SeatInfoDto> Seats { get; set; } = new List<SeatInfoDto>();
}

public class SeatInfoDto
{
    public int Id { get; set; }
    public required string Row { get; set; }
    public int Number { get; set; }
}
}