using System;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;

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
                    
                    for (int day = 0; day < 7; day++)
                    {
                        var date = today.AddDays(day);
                        
                        // Add 3 showtimes per day
                        context.Showtimes.Add(new Showtime
                        {
                            MovieId = movie.Id,
                            ScreenId = screen.Id,
                            StartTime = date.AddHours(14), // 2:00 PM
                            TicketPrice = prices[0]
                        });
                        
                        context.Showtimes.Add(new Showtime
                        {
                            MovieId = movie.Id,
                            ScreenId = screen.Id,
                            StartTime = date.AddHours(17), // 5:00 PM
                            TicketPrice = prices[1]
                        });
                        
                        context.Showtimes.Add(new Showtime
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
}