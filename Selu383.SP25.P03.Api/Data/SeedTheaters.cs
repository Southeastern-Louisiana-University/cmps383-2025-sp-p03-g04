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
                var LionDen1 = new Theater
                {
                    Name = "Lion's Den Cinema 1",
                    Address = "254 East Fairview St, New York City",
                    SeatCount = 150
                };
                
                var LionDen2 = new Theater
                {
                    Name = "Lion's Den Cinema 2",
                    Address = "1228 Saint Anthony St, New Orleans",
                    SeatCount = 200
                };

                var LionDen3 = new Theater
                {
                    Name = "Lion's Den Cinema 3",
                    Address = "8386 Broad St, Los Angeles",
                    SeatCount = 175
                };
                
                context.Theaters.Add(LionDen1);
                context.Theaters.Add(LionDen2);
                context.Theaters.Add(LionDen3);
                context.SaveChanges();
                
                // Create screens for each theater
                var screen1 = new Screen
                {
                    Name = "Screen 1",
                    Capacity = 100,
                    TheaterId = LionDen1.Id
                };
                
                var screen2 = new Screen
                {
                    Name = "Screen 2",
                    Capacity = 80,
                    TheaterId = LionDen1.Id
                };
                
                var screen3 = new Screen
                {
                    Name = "Screen 1",
                    Capacity = 120,
                    TheaterId = LionDen2.Id
                };
                
                var screen4 = new Screen
                {
                    Name = "Screen 2",
                    Capacity = 80,
                    TheaterId = LionDen2.Id
                };

                var screen5 = new Screen
                {
                    Name = "Screen 1",
                    Capacity = 100,
                    TheaterId = LionDen3.Id
                };

                var screen6 = new Screen
                {
                    Name = "Screen 2",
                    Capacity = 120,
                    TheaterId = LionDen3.Id
                };
                
                context.Screens.Add(screen1);
                context.Screens.Add(screen2);
                context.Screens.Add(screen3);
                context.Screens.Add(screen4);
                context.Screens.Add(screen5);
                context.Screens.Add(screen6);
                context.SaveChanges();
                
                // Create seats for each screen
                CreateSeats(context, screen1.Id, 10, 10); // 10 rows, 10 seats per row
                CreateSeats(context, screen2.Id, 8, 10);  // 8 rows, 10 seats per row
                CreateSeats(context, screen3.Id, 10, 12); // 10 rows, 12 seats per row
                CreateSeats(context, screen4.Id, 8, 10);  // 8 rows, 10 seats per row
                CreateSeats(context, screen5.Id, 10, 10); // 10 rows, 10 seats per row
                CreateSeats(context, screen6.Id, 10, 12); // 10 rows, 12 seats per row
                
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
