using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/showtimes")]
    [ApiController]
    public class ShowtimesController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<Showtime> showtimes;

        public ShowtimesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            showtimes = dataContext.Set<Showtime>();
        }

        [HttpGet]
        public IQueryable<ShowtimeDto> GetAllShowtimes()
        {
            return showtimes
                .Include(s => s.Movie)
                .Include("Screen.Theater")
                .Select(s => new ShowtimeDto
                {
                    Id = s.Id,
                    StartTime = s.StartTime,
                    TicketPrice = s.TicketPrice,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movie != null ? s.Movie.Title : string.Empty,
                    ScreenId = s.ScreenId,
                    ScreenName = s.Screen != null ? s.Screen.Name : string.Empty,
                    TheaterId = s.Screen != null ? s.Screen.TheaterId : 0,
                    TheaterName = s.Screen != null && s.Screen.Theater != null ? s.Screen.Theater.Name : string.Empty
                });
        }

        [HttpGet]
        [Route("movie/{movieId}")]
        public IQueryable<ShowtimeDto> GetShowtimesByMovie(int movieId)
        {
            return showtimes
                .Include(s => s.Movie)
                .Include("Screen.Theater")
                .Where(s => s.MovieId == movieId)
                .Select(s => new ShowtimeDto
                {
                    Id = s.Id,
                    StartTime = s.StartTime,
                    TicketPrice = s.TicketPrice,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movie != null ? s.Movie.Title : string.Empty,
                    ScreenId = s.ScreenId,
                    ScreenName = s.Screen != null ? s.Screen.Name : string.Empty,
                    TheaterId = s.Screen != null ? s.Screen.TheaterId : 0,
                    TheaterName = s.Screen != null && s.Screen.Theater != null ? s.Screen.Theater.Name : string.Empty
                });
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<ShowtimeDto> GetShowtimeById(int id)
        {
            var showtime = showtimes
                .Include(s => s.Movie)
                .Include("Screen.Theater")
                .FirstOrDefault(x => x.Id == id);
            
            if (showtime == null)
            {
                return NotFound();
            }

            return new ShowtimeDto
            {
                Id = showtime.Id,
                StartTime = showtime.StartTime,
                TicketPrice = showtime.TicketPrice,
                MovieId = showtime.MovieId,
                MovieTitle = showtime.Movie?.Title ?? string.Empty,
                ScreenId = showtime.ScreenId,
                ScreenName = showtime.Screen?.Name ?? string.Empty,
                TheaterId = showtime.Screen?.TheaterId ?? 0,
                TheaterName = showtime.Screen?.Theater?.Name ?? string.Empty
            };
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<ShowtimeDto> CreateShowtime(ShowtimeDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Showtime data is required");
            }
            
            
            var movie = dataContext.Movies.Find(dto.MovieId);
            if (movie == null)
            {
                return BadRequest("Movie not found");
            }

            
            var screen = dataContext.Screens.Find(dto.ScreenId);
            if (screen == null)
            {
                return BadRequest("Screen not found");
            }

            var showtime = new Showtime
            {
                StartTime = dto.StartTime,
                TicketPrice = dto.TicketPrice,
                MovieId = dto.MovieId,
                ScreenId = dto.ScreenId
            };

            showtimes.Add(showtime);
            dataContext.SaveChanges();

            dto.Id = showtime.Id;
            dto.MovieTitle = movie.Title;
            dto.ScreenName = screen.Name;
            dto.TheaterId = screen.TheaterId;
            dto.TheaterName = screen.Theater?.Name ?? string.Empty;
            
            return CreatedAtAction(nameof(GetShowtimeById), new { id = dto.Id }, dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteShowtime(int id)
        {
            var showtime = showtimes.Find(id);
            if (showtime == null)
            {
                return NotFound();
            }

            showtimes.Remove(showtime);
            dataContext.SaveChanges();

            return Ok();
        }
    }
}