using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Reservations;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<Reservation> reservations;

        public ReservationsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            reservations = dataContext.Set<Reservation>();
        }

        // Class to accept reservation creation request
        public class CreateReservationRequest
        {
            public int ShowtimeId { get; set; }
            public List<int> SeatIds { get; set; } = new List<int>();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReservationDto>> CreateReservation(CreateReservationRequest request)
        {
            if (request == null)
            {
                return BadRequest("Reservation data is required");
            }
            
            // Verify showtime exists
            var showtime = await dataContext.Showtimes
                .Include(s => s.Movie)
                .Include("Screen.Theater")
                .FirstOrDefaultAsync(s => s.Id == request.ShowtimeId);

            if (showtime == null)
            {
                return NotFound("Showtime not found");
            }

            // Verify seats exist and belong to the right screen
            var seats = await dataContext.Seats
                .Where(s => request.SeatIds.Contains(s.Id) && s.ScreenId == showtime.ScreenId)
                .ToListAsync();

            if (seats.Count != request.SeatIds.Count)
            {
                return BadRequest("One or more seats are invalid");
            }

            // Verify seats are available
            var reservedSeatIds = await dataContext.ReservationSeats
                .Where(rs => rs.Reservation != null && rs.Reservation.ShowtimeId == request.ShowtimeId)
                .Select(rs => rs.SeatId)
                .ToListAsync();

            var unavailableSeats = seats.Where(s => reservedSeatIds.Contains(s.Id)).ToList();
            if (unavailableSeats.Any())
            {
                return BadRequest("One or more seats are already reserved");
            }

            // Get current user
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == (User.Identity != null ? User.Identity.Name : null));
            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Calculate total amount
            decimal totalAmount = showtime.TicketPrice * request.SeatIds.Count;

            // Create reservation
            var reservation = new Reservation
            {
                ShowtimeId = request.ShowtimeId,
                UserId = user.Id,
                ReservationTime = DateTime.UtcNow,
                TotalAmount = totalAmount,
                IsPaid = false
            };

            reservations.Add(reservation);
            await dataContext.SaveChangesAsync();

            // Add seat reservations
            foreach (var seatId in request.SeatIds)
            {
                dataContext.ReservationSeats.Add(new ReservationSeat
                {
                    ReservationId = reservation.Id,
                    SeatId = seatId
                });
            }

            await dataContext.SaveChangesAsync();

            // Map to DTO for response
            var reservationDto = new ReservationDto
            {
                Id = reservation.Id,
                ReservationTime = reservation.ReservationTime,
                IsPaid = reservation.IsPaid,
                TotalAmount = reservation.TotalAmount,
                UserId = reservation.UserId,
                ShowtimeId = reservation.ShowtimeId,
                ShowtimeStartTime = showtime.StartTime,
                MovieTitle = showtime.Movie?.Title ?? string.Empty,
                TheaterName = showtime.Screen?.Theater?.Name ?? string.Empty,
                ScreenName = showtime.Screen?.Name ?? string.Empty,
                Seats = seats.Select(s => new SeatInfoDto
                {
                    Id = s.Id,
                    Row = s.Row,
                    Number = s.Number
                }).ToList()
            };

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservationDto);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ReservationDto>> GetReservation(int id)
        {
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == (User.Identity != null ? User.Identity.Name : null));
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var reservation = await reservations
                .Include("Showtime.Movie")
                .Include("Showtime.Screen.Theater")
                .Include(r => r.ReservationSeats)
                .ThenInclude(rs => rs.Seat)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            // Only allow users to see their own reservations unless admin
            if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            return new ReservationDto
            {
                Id = reservation.Id,
                ReservationTime = reservation.ReservationTime,
                IsPaid = reservation.IsPaid,
                TotalAmount = reservation.TotalAmount,
                UserId = reservation.UserId,
                ShowtimeId = reservation.ShowtimeId,
                ShowtimeStartTime = reservation.Showtime?.StartTime ?? DateTime.MinValue,
                MovieTitle = reservation.Showtime?.Movie?.Title ?? string.Empty,
                TheaterName = reservation.Showtime?.Screen?.Theater?.Name ?? string.Empty,
                ScreenName = reservation.Showtime?.Screen?.Name ?? string.Empty,
                Seats = reservation.ReservationSeats
                    .Select(rs => new SeatInfoDto
                    {
                        Id = rs.Seat?.Id ?? 0,
                        Row = rs.Seat?.Row ?? string.Empty,
                        Number = rs.Seat?.Number ?? 0
                    }).ToList()
            };
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<ReservationDto>>> GetUserReservations(int userId)
        {
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == (User.Identity != null ? User.Identity.Name : null));
            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Only allow users to see their own reservations unless admin
            if (userId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            var userReservations = await reservations
                .Include(r => r.Showtime)

                .Include(r => r.ReservationSeats)
                .ThenInclude(rs => rs.Seat)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            var reservationDtos = userReservations.Select(r => new ReservationDto
            {
                Id = r.Id,
                ReservationTime = r.ReservationTime,
                IsPaid = r.IsPaid,
                TotalAmount = r.TotalAmount,
                UserId = r.UserId,
                ShowtimeId = r.ShowtimeId,
                ShowtimeStartTime = r.Showtime?.StartTime ?? DateTime.MinValue,
                MovieTitle = r.Showtime?.Movie?.Title ?? string.Empty,
                TheaterName = r.Showtime?.Screen?.Theater?.Name ?? string.Empty,
                ScreenName = r.Showtime?.Screen?.Name ?? string.Empty,
                Seats = r.ReservationSeats
                    .Select(rs => new SeatInfoDto
                    {
                        Id = rs.Seat?.Id ?? 0,
                        Row = rs.Seat?.Row ?? string.Empty,
                        Number = rs.Seat?.Number ?? 0
                    }).ToList()
            }).ToList();

            return reservationDtos;
        }

        [HttpPut("{id}/pay")]
        [Authorize]
        public async Task<ActionResult<ReservationDto>> MarkAsPaid(int id)
        {
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == (User.Identity != null ? User.Identity.Name : null));
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var reservation = await reservations
                .Include("Showtime.Movie")
                .Include("Showtime.Screen.Theater")
                .Include(r => r.ReservationSeats)
                .ThenInclude(rs => rs.Seat)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            // Only allow users to update their own reservations unless admin
            if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            // Update payment status
            reservation.IsPaid = true;
            await dataContext.SaveChangesAsync();

            return new ReservationDto
            {
                Id = reservation.Id,
                ReservationTime = reservation.ReservationTime,
                IsPaid = reservation.IsPaid,
                TotalAmount = reservation.TotalAmount,
                UserId = reservation.UserId,
                ShowtimeId = reservation.ShowtimeId,
                ShowtimeStartTime = reservation.Showtime?.StartTime ?? DateTime.MinValue,
                MovieTitle = reservation.Showtime?.Movie?.Title ?? string.Empty,
                TheaterName = reservation.Showtime?.Screen?.Theater?.Name ?? string.Empty,
                ScreenName = reservation.Showtime?.Screen?.Name ?? string.Empty,
                Seats = reservation.ReservationSeats
                    .Select(rs => new SeatInfoDto
                    {
                        Id = rs.Seat?.Id ?? 0,
                        Row = rs.Seat?.Row ?? string.Empty,
                        Number = rs.Seat?.Number ?? 0
                    }).ToList()
            };
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> CancelReservation(int id)
        {
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == (User.Identity != null ? User.Identity.Name : null));
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var reservation = await reservations
                .Include(r => r.ReservationSeats)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            // Only allow users to cancel their own reservations unless admin
            if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            // Delete associated ReservationSeats
            dataContext.ReservationSeats.RemoveRange(reservation.ReservationSeats);
            
            // Delete reservation
            reservations.Remove(reservation);
            await dataContext.SaveChangesAsync();

            return Ok();
        }
    }
}