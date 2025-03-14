using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Services;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/tmdb")]
    [ApiController]
    public class TmdbController : ControllerBase
    {
        private readonly TmdbService _tmdbService;
        private readonly DataContext _dataContext;

        public TmdbController(TmdbService tmdbService, DataContext dataContext)
        {
            _tmdbService = tmdbService;
            _dataContext = dataContext;
        }

        [HttpGet("search")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<TmdbMovieSearchResponse>> SearchMovies([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query is required");
            }
            
            var results = await _tmdbService.SearchMoviesAsync(query);
            return Ok(results);
        }

        [HttpGet("now-playing")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<TmdbMovieSearchResponse>> GetNowPlaying()
        {
            var results = await _tmdbService.GetNowPlayingMoviesAsync();
            return Ok(results);
        }

        [HttpPost("import/{tmdbId}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public async Task<ActionResult<MovieDto>> ImportMovie(int tmdbId)
        {
            // Check if movie already exists in our database
            var existingMovie = await _dataContext.Movies.FirstOrDefaultAsync(m => m.TmdbId == tmdbId);
            if (existingMovie != null)
            {
                return BadRequest("Movie already exists in the database");
            }
            
            // Get movie details from TMDB
            var tmdbMovie = await _tmdbService.GetMovieDetailsAsync(tmdbId);
            
            // Map to our movie model
            var movie = _tmdbService.MapToMovie(tmdbMovie);
            
            // Save to database
            _dataContext.Movies.Add(movie);
            await _dataContext.SaveChangesAsync();
            
            // Return DTO
            return new MovieDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description ?? string.Empty,
                PosterUrl = movie.PosterUrl ?? string.Empty,
                Runtime = movie.Runtime,
                Rating = movie.Rating ?? string.Empty,
                ReleaseDate = movie.ReleaseDate
            };
        }
    }
}