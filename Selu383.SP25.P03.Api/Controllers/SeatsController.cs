using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public async Task<ActionResult<SeatingLayoutDto>> GetSeatsForShowtime(int showtimeId, [FromQuery] int? userId = null)
        {
            var showtime = await dataContext.Showtimes
                .Include("Screen.Seats")
                .Include("Screen.Theater")
                .Include(s => s.Movie)
                .FirstOrDefaultAsync(s => s.Id == showtimeId);

            if (showtime == null)
            {
                return NotFound("Showtime not found");
            }

            
            var seats = showtime.Screen?.Seats?.ToList() ?? new List<Seat>();

            
            var reservedSeatIds = await dataContext.ReservationSeats
                .Where(rs => rs.Reservation != null && rs.Reservation.ShowtimeId == showtimeId && rs.Reservation.IsPaid)
                .Select(rs => rs.SeatId)
                .ToHashSetAsync();

            
            var selectedSeatIds = new HashSet<int>();
            if (userId.HasValue)
            {
                selectedSeatIds = await dataContext.ReservationSeats
                    .Where(rs => rs.Reservation != null && 
                           rs.Reservation.ShowtimeId == showtimeId && 
                           rs.Reservation.UserId == userId.Value && 
                           !rs.Reservation.IsPaid)
                    .Select(rs => rs.SeatId)
                    .ToHashSetAsync();
            }

            
            var seatsByRow = seats
                .GroupBy(s => s.Row)
                .OrderBy(g => g.Key)
                .ToDictionary(
                    g => g.Key,
                    g => g.OrderBy(s => s.Number)
                         .Select(seat => new SeatDto
                         {
                             Id = seat.Id,
                             Row = seat.Row,
                             Number = seat.Number,
                             ScreenId = seat.ScreenId,
                             Status = selectedSeatIds.Contains(seat.Id) 
                                      ? SeatStatus.Selected 
                                      : (reservedSeatIds.Contains(seat.Id) ? SeatStatus.Taken : SeatStatus.Available)
                         })
                         .ToList()
                );
            
            return new SeatingLayoutDto
            {
                ShowtimeId = showtimeId,
                MovieTitle = showtime.Movie?.Title ?? string.Empty,
                StartTime = showtime.StartTime,
                ScreenName = showtime.Screen?.Name ?? string.Empty,
                TheaterId = showtime.Screen?.TheaterId ?? 0,
                TheaterName = showtime.Screen?.Theater?.Name ?? string.Empty,
                TicketPrice = showtime.TicketPrice,
                Rows = seatsByRow
            };
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
                Status = SeatStatus.Available
            }).ToArray();

            return seatDtos;
        }
    }
}