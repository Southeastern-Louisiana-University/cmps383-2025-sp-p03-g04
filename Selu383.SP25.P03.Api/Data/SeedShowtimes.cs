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
                
                if (context.Showtimes.Any())
                {
                    return;   
                }
                
                try
                {
                    
                    var showtimeService = serviceProvider.GetRequiredService<ShowtimeManagementService>();
                    showtimeService.GenerateShowtimesForNext48Hours().Wait();
                }
                catch (Exception)
                {
                    
                    FallbackSeedShowtimes(context);
                }
            }
        }

        private static void FallbackSeedShowtimes(DataContext context)
        {
            
            var movies = context.Movies.ToList();
            var screens = context.Screens.ToList();
            
            if (!movies.Any() || !screens.Any())
            {
                return; 
            }

            
            var today = DateTime.Today;
            decimal[] prices = { 9.99m, 12.99m, 14.99m };

            foreach (var movie in movies)
            {
                
                var screen = screens[new Random().Next(screens.Count)];
                
                for (int day = 0; day < 2; day++) 
                {
                    var date = today.AddDays(day);
                    
                    
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(14), 
                        TicketPrice = prices[0]
                    });
                    
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(17), 
                        TicketPrice = prices[1]
                    });
                    
                    context.Showtimes.Add(new Features.Movies.Showtime
                    {
                        MovieId = movie.Id,
                        ScreenId = screen.Id,
                        StartTime = date.AddHours(20), 
                        TicketPrice = prices[2]
                    });
                }
            }

            context.SaveChanges();
        }
    }
}