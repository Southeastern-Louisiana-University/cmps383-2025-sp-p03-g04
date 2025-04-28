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
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Selu383.SP25.P03.Api.Services;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<Reservation> reservations;
        private readonly UserManager<User> userManager;

public ReservationsController(DataContext dataContext, UserManager<User> userManager)
{
    this.dataContext = dataContext;
    this.reservations = dataContext.Set<Reservation>();
    this.userManager = userManager;
}

    [HttpPost]
[Authorize]
public async Task<ActionResult<ReservationDto>> CreateReservation(CreateReservationRequest request)
{
    if (request == null || request.Tickets.Count == 0)
    {
        return BadRequest("Reservation data is required and must include at least one ticket");
    }
    
    
    var cutoffTime = DateTime.UtcNow.AddMinutes(-15);
    var expiredReservations = await dataContext.ReservationSeats
        .Where(rs => rs.Reservation != null && 
                    rs.Reservation.ShowtimeId == request.ShowtimeId && 
                    !rs.Reservation.IsPaid && 
                    rs.Reservation.ReservationTime < cutoffTime)
        .Select(rs => rs.ReservationId)
        .Distinct()
        .ToListAsync();
    
    
    if (expiredReservations.Any())
    {
        foreach (var expiredId in expiredReservations)
        {
            var expiredSeats = await dataContext.ReservationSeats
                .Where(rs => rs.ReservationId == expiredId)
                .ToListAsync();
                
            dataContext.ReservationSeats.RemoveRange(expiredSeats);
            
            var expiredReservation = await dataContext.Reservations.FindAsync(expiredId);
            if (expiredReservation != null)
                dataContext.Reservations.Remove(expiredReservation);
        }
        
        await dataContext.SaveChangesAsync();
    }
    
    
    var showtime = await dataContext.Showtimes
        .Include(s => s.Movie)
        .Include("Screen.Theater")
        .FirstOrDefaultAsync(s => s.Id == request.ShowtimeId);

    if (showtime == null)
    {
        return NotFound("Showtime not found");
    }

    
    var seatIds = request.Tickets.Select(t => t.SeatId).ToList();

    
    var seats = await dataContext.Seats
        .Where(s => seatIds.Contains(s.Id) && s.ScreenId == showtime.ScreenId)
        .ToListAsync();

    if (seats.Count != seatIds.Count)
    {
        return BadRequest("One or more seats are invalid");
    }

    
    var reservedSeatIds = await dataContext.ReservationSeats
        .Where(rs => rs.Reservation != null && rs.Reservation.ShowtimeId == request.ShowtimeId && rs.Reservation.IsPaid)
        .Select(rs => rs.SeatId)
        .ToListAsync();

    var unavailableSeats = seats.Where(s => reservedSeatIds.Contains(s.Id)).ToList();
    if (unavailableSeats.Any())
    {
        return BadRequest("One or more seats are already reserved");
    }

    
    var userName = User.Identity?.Name;
    var user = userName != null 
        ? await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == userName)
        : null;

    if (user == null)
    {
        return BadRequest("User not found");
    }

    
    foreach (var ticket in request.Tickets)
    {
        switch (ticket.TicketType.ToLower())
        {
            case "child":
                ticket.Price = showtime.TicketPrice * 0.75m; 
                break;
            case "senior":
                ticket.Price = showtime.TicketPrice * 0.8m; 
                break;
            default: 
                ticket.Price = showtime.TicketPrice;
                break;
        }
    }

    
    decimal totalAmount = request.Tickets.Sum(t => t.Price);

    
    var reservation = new Reservation
    {
        ShowtimeId = request.ShowtimeId,
        UserId = user.Id,
        ReservationTime = DateTime.UtcNow,
        TotalAmount = totalAmount,
        IsPaid = request.ProcessPayment 
    };

    reservations.Add(reservation);
    await dataContext.SaveChangesAsync();

    
    foreach (var ticket in request.Tickets)
    {
        var seat = seats.First(s => s.Id == ticket.SeatId);
        
        dataContext.ReservationSeats.Add(new ReservationSeat
        {
            ReservationId = reservation.Id,
            SeatId = ticket.SeatId,
            TicketType = ticket.TicketType,
            Price = ticket.Price
        });
    }

    await dataContext.SaveChangesAsync();

    
    var ticketDtos = new List<TicketDto>();
    foreach (var reservationSeat in dataContext.ReservationSeats
        .Where(rs => rs.ReservationId == reservation.Id)
        .Include(rs => rs.Seat))
    {
        ticketDtos.Add(new TicketDto
        {
            Id = reservationSeat.Id,
            SeatId = reservationSeat.SeatId,
            Row = reservationSeat.Seat?.Row ?? string.Empty,
            Number = reservationSeat.Seat?.Number ?? 0,
            TicketType = reservationSeat.TicketType,
            Price = reservationSeat.Price
        });
    }

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
        Tickets = ticketDtos
    };

    return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservationDto);
}

   [HttpGet("{id}/ticket")]
[Authorize]
public async Task<ActionResult> GetTicket(int id)
{
    try
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var reservation = await reservations.FirstOrDefaultAsync(r => r.Id == id);
        if (reservation == null)
        {
            return NotFound();
        }

        
        if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
        {
            return Forbid();
        }

        
        var ticketService = HttpContext.RequestServices.GetRequiredService<TicketService>();
        var qrCodeImage = await ticketService.GenerateTicketQRCode(id);

        return File(qrCodeImage, "image/png");
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception)
    {
        return StatusCode(500, "An error occurred generating the ticket");
    }
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

            
            if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            var ticketDtos = reservation.ReservationSeats
                .Select(rs => new TicketDto
                {
                    Id = rs.Id,
                    SeatId = rs.SeatId,
                    Row = rs.Seat?.Row ?? string.Empty,
                    Number = rs.Seat?.Number ?? 0,
                    TicketType = rs.TicketType,
                    Price = rs.Price
                }).ToList();

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
                Tickets = ticketDtos
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

            
            if (userId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

var userReservations = await reservations
    .Include(r => r.Showtime)
    .Include("Showtime.Movie")
    .Include("Showtime.Screen.Theater")
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
                Tickets = r.ReservationSeats.Select(rs => new TicketDto
                {
                    Id = rs.Id,
                    SeatId = rs.SeatId,
                    Row = rs.Seat?.Row ?? string.Empty,
                    Number = rs.Seat?.Number ?? 0,
                    TicketType = rs.TicketType,
                    Price = rs.Price
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

            var ticketDtos = reservation.ReservationSeats
                .Select(rs => new TicketDto
                {
                    Id = rs.Id,
                    SeatId = rs.SeatId,
                    Row = rs.Seat?.Row ?? string.Empty,
                    Number = rs.Seat?.Number ?? 0,
                    TicketType = rs.TicketType,
                    Price = rs.Price
                }).ToList();

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
                Tickets = ticketDtos
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

            
            if (reservation.UserId != user.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            
            dataContext.ReservationSeats.RemoveRange(reservation.ReservationSeats);
            
            
            reservations.Remove(reservation);
            await dataContext.SaveChangesAsync();

            return Ok();
        }
    }
}