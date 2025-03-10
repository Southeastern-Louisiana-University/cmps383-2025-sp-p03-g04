using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Features.Reservations
{
    public class ReservationSeat
    {
    public int Id { get; set; }
    
    public int ReservationId { get; set; }
    
    public int SeatId { get; set; }
    
    public virtual Reservation? Reservation { get; set; }
    
    public virtual Seat? Seat { get; set; }
    
    }
}