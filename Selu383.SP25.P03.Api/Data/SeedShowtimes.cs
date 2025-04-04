using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Selu383.SP25.P03.Api.Services;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedShowtimes
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any showtimes
                if (context.Showtimes.Any())
                {
                    return;   // DB has been seeded
                }
                
                try
                {
                    // Use the showtime management service to generate showtimes
                    var showtimeService = serviceProvider.GetRequiredService<ShowtimeManagementService>();
                    showtimeService.GenerateShowtimesForNext48Hours().Wait();
                }
                catch (Exception)
                {
                    // Fallback to original seeding logic if the service fails
                    // This ensures compatibility if the service isn't registered
                    FallbackSeedShowtimes(context);
                }
            }
        }

        private static void FallbackSeedShowtimes(DataContext context)
        {
            // This is the original seeding logic as a fallback
            var movies = context.Movies.ToList();
            var screens = context.Screens.ToList();
            
            if (!movies.Any() || !screens.Any())
            {
                return; // Make sure movies and screens are seeded first
            }

            // Create showtimes for the next 7 days
            var today = DateTime.Today;
            decimal[] prices = { 9.99m, 12.99m, 14.99m };

            foreach (var movie in movies)
            {
                // Each movie shows in one theater for a week
                var screen = screens[new Random().Next(screens.Count)];
                
                for (int day = 0; day < 2; day++) // Changed from 7 to 2 days
                {
                    var date = today.AddDays(day);
                    
                    // Add 3 showtimes per day
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(14), // 2:00 PM
                        TicketPrice = prices[0]
                    });
                    
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(17), // 5:00 PM
                        TicketPrice = prices[1]
                    });
                    
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(20), // 8:00 PM
                        TicketPrice = prices[2]
                    });
                }
            }

            context.SaveChanges();
        }
    }
}