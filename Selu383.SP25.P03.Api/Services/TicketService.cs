using QRCoder;
using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Services
{
    public class TicketService
    {
        private readonly DataContext _dataContext;
        
        public TicketService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        
        public async Task<byte[]> GenerateTicketQRCode(int reservationId)
        {
            var reservation = await _dataContext.Reservations
                .Include(r => r.ReservationSeats)
                .ThenInclude(rs => rs.Seat)
                .Include("Showtime.Movie")
                .Include("Showtime.Screen.Theater")
                .FirstOrDefaultAsync(r => r.Id == reservationId);
                
            if (reservation == null)
                throw new ArgumentException("Reservation not found");
                
            if (!reservation.IsPaid)
                throw new InvalidOperationException("Cannot generate ticket for unpaid reservation");
            
            // Create ticket data in JSON format
            var ticketData = new
            {
                ReservationId = reservation.Id,
                MovieTitle = reservation.Showtime?.Movie?.Title,
                TheaterName = reservation.Showtime?.Screen?.Theater?.Name,
                ScreenName = reservation.Showtime?.Screen?.Name,
                ShowtimeStart = reservation.Showtime?.StartTime,
                Seats = reservation.ReservationSeats.Select(rs => new {
                    Row = rs.Seat?.Row,
                    Number = rs.Seat?.Number,
                    TicketType = rs.TicketType
                }).ToList(),
                ValidationCode = GenerateValidationCode(reservation.Id)
            };
            
            // Serialize to JSON
            string jsonData = System.Text.Json.JsonSerializer.Serialize(ticketData);
            
            // Generate QR code
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(jsonData, QRCodeGenerator.ECCLevel.Q);
            BitmapByteQRCode qrCode = new BitmapByteQRCode(qrCodeData);
            byte[] qrCodeImage = qrCode.GetGraphic(20);
            
            return qrCodeImage;
        }
        
        private string GenerateValidationCode(int reservationId)
        {
            // Generate a unique validation code combining reservation ID and a random element
            string uniqueElement = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
                .Substring(0, 8).Replace("/", "_").Replace("+", "-");
            
            return $"LD{reservationId:D6}{uniqueElement}";
        }
    }
}