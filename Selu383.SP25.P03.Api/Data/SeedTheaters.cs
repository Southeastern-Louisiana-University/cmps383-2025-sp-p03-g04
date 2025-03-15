using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Theaters;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedTheaters
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                // Look for any theaters.
                if (context.Theaters.Any())
                {
                    return;   // DB has been seeded
                }
                
                // Create theaters
                var amcPalace = new Theater
                {
                    Name = "AMC Palace 10",
                    Address = "123 Main St, Springfield",
                    SeatCount = 150
                };
                
                var regalCinema = new Theater
                {
                    Name = "Regal Cinema",
                    Address = "456 Elm St, Shelbyville",
                    SeatCount = 200
                };
                
                context.Theaters.Add(amcPalace);
                context.Theaters.Add(regalCinema);
                context.SaveChanges();
                
                // Create screens for each theater
                var screen1 = new Screen
                {
                    Name = "Screen 1",
                    Capacity = 100,
                    TheaterId = amcPalace.Id
                };
                
                var screen2 = new Screen
                {
                    Name = "Screen 2",
                    Capacity = 80,
                    TheaterId = amcPalace.Id
                };
                
                var screen3 = new Screen
                {
                    Name = "Screen 1",
                    Capacity = 120,
                    TheaterId = regalCinema.Id
                };
                
                var screen4 = new Screen
                {
                    Name = "Screen 2",
                    Capacity = 80,
                    TheaterId = regalCinema.Id
                };
                
                context.Screens.Add(screen1);
                context.Screens.Add(screen2);
                context.Screens.Add(screen3);
                context.Screens.Add(screen4);
                context.SaveChanges();
                
                // Create seats for each screen
                CreateSeats(context, screen1.Id, 10, 10); // 10 rows, 10 seats per row
                CreateSeats(context, screen2.Id, 8, 10);  // 8 rows, 10 seats per row
                CreateSeats(context, screen3.Id, 10, 12); // 10 rows, 12 seats per row
                CreateSeats(context, screen4.Id, 8, 10);  // 8 rows, 10 seats per row
                
                context.SaveChanges();
            }
        }
        
        private static void CreateSeats(DataContext context, int screenId, int rows, int seatsPerRow)
        {
            string[] rowLetters = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O" };
            
            for (int row = 0; row < rows; row++)
            {
                for (int seatNum = 1; seatNum <= seatsPerRow; seatNum++)
                {
                    context.Seats.Add(new Seat
                    {
                        Row = rowLetters[row],
                        Number = seatNum,
                        ScreenId = screenId
                    });
                }
            }
        }
    }
}
