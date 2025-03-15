using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/seats")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly DataContext dataContext;

        public SeatsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpGet]
        [Route("showtime/{showtimeId}")]
        public ActionResult<SeatDto[]> GetSeatsForShowtime(int showtimeId)
        {
            var showtime = dataContext.Showtimes
                .Include("Screen.Seats")
                .FirstOrDefault(s => s.Id == showtimeId);

            if (showtime == null)
            {
                return NotFound("Showtime not found");
            }

            // Get all seats for the screen
            var seats = showtime.Screen?.Seats?.ToList() ?? new List<Seat>();

            // Get all reserved seats for this showtime
            var reservedSeatIds = dataContext.ReservationSeats
                .Where(rs => rs.Reservation != null && rs.Reservation.ShowtimeId == showtimeId)
                .Select(rs => rs.SeatId)
                .ToHashSet();

            // Map to DTOs with availability info
            var seatDtos = seats.Select(seat => new SeatDto
            {
                Id = seat.Id,
                Row = seat.Row,
                Number = seat.Number,
                ScreenId = seat.ScreenId,
                IsAvailable = !reservedSeatIds.Contains(seat.Id)
            }).ToArray();

            return seatDtos;
        }

        [HttpGet]
        [Route("screen/{screenId}")]
        public ActionResult<SeatDto[]> GetSeatsForScreen(int screenId)
        {
            var screen = dataContext.Screens
                .Include(s => s.Seats)
                .FirstOrDefault(s => s.Id == screenId);

            if (screen == null)
            {
                return NotFound("Screen not found");
            }

            var seatDtos = (screen.Seats ?? new List<Seat>()).Select(seat => new SeatDto
            {
                Id = seat.Id,
                Row = seat.Row,
                Number = seat.Number,
                ScreenId = seat.ScreenId,
                IsAvailable = true
            }).ToArray();

            return seatDtos;
        }
    }
}