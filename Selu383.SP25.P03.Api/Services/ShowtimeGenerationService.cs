using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Selu383.SP25.P03.Api.Services
{
    public class ShowtimeGenerationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ShowtimeGenerationService> _logger;
        
        public ShowtimeGenerationService(IServiceProvider serviceProvider, ILogger<ShowtimeGenerationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Generating showtimes for the next 48 hours");
                    
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var showtimeService = scope.ServiceProvider.GetRequiredService<ShowtimeManagementService>();
                        await showtimeService.GenerateShowtimesForNext48Hours();
                    }
                    
                    _logger.LogInformation("Showtime generation completed successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while generating showtimes");
                }
                
                // Run once a day at midnight
                var now = DateTime.Now;
                var midnight = now.Date.AddDays(1);
                var delay = midnight - now;
                
                _logger.LogInformation($"Next showtime generation scheduled in {delay.TotalHours:F1} hours");
                await Task.Delay(delay, stoppingToken);
            }
        }
    }
}