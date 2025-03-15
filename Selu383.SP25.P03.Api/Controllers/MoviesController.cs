using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/movies")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly DataContext dataContext;
        private readonly DbSet<Movie> movies;

        public MoviesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            movies = dataContext.Set<Movie>();
        }

        [HttpGet]
        public IQueryable<MovieDto> GetAllMovies()
        {
            return movies
                .Select(m => new MovieDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description ?? string.Empty,
                    PosterUrl = m.PosterUrl ?? string.Empty,
                    Runtime = m.Runtime,
                    Rating = m.Rating ?? string.Empty,
                    ReleaseDate = m.ReleaseDate
                });
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<MovieDto> GetMovieById(int id)
        {
            var movie = movies.FirstOrDefault(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

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

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<MovieDto> CreateMovie(MovieDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Movie data is required");
            }

            var movie = new Movie
            {
                Title = dto.Title,
                Description = dto.Description ?? string.Empty,
                PosterUrl = dto.PosterUrl ?? string.Empty,
                Runtime = dto.Runtime,
                Rating = dto.Rating ?? string.Empty,
                ReleaseDate = dto.ReleaseDate
            };

            movies.Add(movie);
            dataContext.SaveChanges();

            dto.Id = movie.Id;
            return CreatedAtAction(nameof(GetMovieById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<MovieDto> UpdateMovie(int id, MovieDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Movie data is required");
            }

            var movie = movies.FirstOrDefault(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

            movie.Title = dto.Title;
            movie.Description = dto.Description ?? string.Empty;
            movie.PosterUrl = dto.PosterUrl ?? string.Empty;
            movie.Runtime = dto.Runtime;
            movie.Rating = dto.Rating ?? string.Empty;
            movie.ReleaseDate = dto.ReleaseDate;

            dataContext.SaveChanges();
            
            dto.Id = movie.Id;
            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteMovie(int id)
        {
            var movie = movies.FirstOrDefault(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

            movies.Remove(movie);
            dataContext.SaveChanges();

            return Ok();
        }
    }
}