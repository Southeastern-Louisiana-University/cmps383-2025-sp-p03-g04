using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Reservations;

namespace Selu383.SP25.P03.Api.Services
{
    public class ShowtimeManagementService
    {
        private readonly DataContext _context;
        
        public ShowtimeManagementService(DataContext context)
        {
            _context = context;
        }
        
        public async Task GenerateShowtimesIfNoneExist()
        {
            // Check if there are any showtimes in the database
            var hasShowtimes = await _context.Showtimes.AnyAsync();
            
            if (!hasShowtimes)
            {
                // If no showtimes exist, generate them
                await GenerateShowtimesForNext48Hours();
            }
        }
        
        public async Task GenerateShowtimesForNext48Hours()
        {
            // Get today's date and time
            var now = DateTime.Now;
            var twoDateCutoff = now.AddDays(2);
            
            // Get all movies
            var activeMovies = await _context.Movies.ToListAsync();
            if (!activeMovies.Any())
            {
                // No movies available to create showtimes
                return;
            }
            
            // Get all screens
            var screens = await _context.Screens.ToListAsync();
            if (!screens.Any())
            {
                // No screens available to create showtimes
                return;
            }
            
            // Delete any future showtimes that don't have tickets sold
            var futureShowtimes = await _context.Showtimes
                .Where(s => s.StartTime > now)
                .ToListAsync();
                
            var showtimesToDelete = new List<Showtime>();
            
            foreach (var showtime in futureShowtimes)
            {
                // Check if any tickets sold
                var hasTickets = await _context.Reservations
                    .AnyAsync(r => r.ShowtimeId == showtime.Id);
                    
                if (!hasTickets)
                {
                    showtimesToDelete.Add(showtime);
                }
            }
            
            if (showtimesToDelete.Any())
            {
                _context.Showtimes.RemoveRange(showtimesToDelete);
                await _context.SaveChangesAsync();
            }
            
            // Get all existing showtimes in the next 48 hours
            var existingShowtimes = await _context.Showtimes
                .Where(s => s.StartTime >= now && s.StartTime <= twoDateCutoff)
                .ToListAsync();
                
            // Generate new showtimes
            var newShowtimes = new List<Showtime>();
            var random = new Random();
            
            // Standard showtime slots (can be configured)
            var slots = new[] { 
                new TimeSpan(10, 0, 0),  // 10:00 AM
                new TimeSpan(13, 0, 0),  // 1:00 PM
                new TimeSpan(16, 0, 0),  // 4:00 PM
                new TimeSpan(19, 0, 0),  // 7:00 PM
                new TimeSpan(22, 0, 0)   // 10:00 PM
            };
            
            // For each day (today and tomorrow)
            for (int day = 0; day < 2; day++)
            {
                var date = now.Date.AddDays(day);
                
                // For each screen
                foreach (var screen in screens)
                {
                    // Assign a movie to this screen for today
                    var movie = activeMovies[random.Next(activeMovies.Count)];
                    
                    // For each time slot
                    foreach (var slot in slots)
                    {
                        var showtimeDateTime = date.Add(slot);
                        
                        // Skip if in the past
                        if (showtimeDateTime <= now)
                            continue;
                            
                        // Skip if already exists
                        if (existingShowtimes.Any(s => 
                            s.ScreenId == screen.Id && 
                            s.StartTime.Date == showtimeDateTime.Date &&
                            Math.Abs((s.StartTime.TimeOfDay - showtimeDateTime.TimeOfDay).TotalMinutes) < 15))
                            continue;
                            
                        // Calculate base price (you can add logic for premium times)
                        decimal basePrice = 12.99m;
                        if (slot >= new TimeSpan(17, 0, 0)) // After 5pm
                            basePrice = 15.99m;
                        
                        // Add the showtime
                        newShowtimes.Add(new Showtime
                        {
                            MovieId = movie.Id,
                            ScreenId = screen.Id,
                            StartTime = showtimeDateTime,
                            TicketPrice = basePrice
                        });
                    }
                }
            }
            
            // Add new showtimes to database
            if (newShowtimes.Any())
            {
                await _context.Showtimes.AddRangeAsync(newShowtimes);
                await _context.SaveChangesAsync();
            }
        }
    }
}