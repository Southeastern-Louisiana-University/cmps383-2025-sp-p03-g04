using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Selu383.SP25.P03.Api.Data;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Services
{
    public class ReservationTimeoutService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ReservationTimeoutService> _logger;
        private readonly TimeSpan _reservationTimeout = TimeSpan.FromMinutes(15); // 15 minute timeout

        public ReservationTimeoutService(IServiceProvider serviceProvider, ILogger<ReservationTimeoutService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Reservation Timeout Service is running");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessExpiredReservations();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing expired reservations");
                }

                // Check every minute
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task ProcessExpiredReservations()
        {
            _logger.LogInformation("Checking for expired reservations");

            using var scope = _serviceProvider.CreateScope();
            var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

            var cutoffTime = DateTime.UtcNow.Subtract(_reservationTimeout);
            
            // reservations that haven't been paid for
            var expiredReservations = await dataContext.Reservations
                .Include(r => r.ReservationSeats)
                .Where(r => !r.IsPaid && r.ReservationTime < cutoffTime)
                .ToListAsync();

            if (!expiredReservations.Any())
            {
                _logger.LogInformation("No expired reservations found");
                return;
            }

            _logger.LogInformation($"Found {expiredReservations.Count} expired reservations to remove");

            foreach (var reservation in expiredReservations)
            {
                // Remove reservation seats first
                dataContext.ReservationSeats.RemoveRange(reservation.ReservationSeats);
                
                // Then remove the reservation
                dataContext.Reservations.Remove(reservation);
                
                _logger.LogInformation($"Removed expired reservation #{reservation.Id} created at {reservation.ReservationTime}");
            }

            await dataContext.SaveChangesAsync();
            _logger.LogInformation($"Successfully removed {expiredReservations.Count} expired reservations");
        }
    }
}