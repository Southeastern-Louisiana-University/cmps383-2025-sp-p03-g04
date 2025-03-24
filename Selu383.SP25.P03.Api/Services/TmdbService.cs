using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Services
{
    public class TmdbService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly JsonSerializerOptions _jsonOptions;

        public TmdbService(IConfiguration configuration, HttpClient httpClient)
        {
            _apiKey = configuration["Tmdb:ApiKey"] ?? 
                      Environment.GetEnvironmentVariable("TMDB_API_KEY") ?? 
                      throw new InvalidOperationException("TMDB API key not configured");
            
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://api.themoviedb.org/3/");
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        public async Task<TmdbMovieSearchResponse> SearchMoviesAsync(string query)
        {
            var response = await _httpClient.GetAsync($"search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}");
            response.EnsureSuccessStatusCode();
    
            var result = await response.Content.ReadFromJsonAsync<TmdbMovieSearchResponse>(_jsonOptions);
            return result ?? new TmdbMovieSearchResponse(); // Return empty response if null
        }

        public async Task<TmdbMovieDetails> GetMovieDetailsAsync(int tmdbId)
        {
            var response = await _httpClient.GetAsync($"movie/{tmdbId}?api_key={_apiKey}");
            response.EnsureSuccessStatusCode();
    
            var result = await response.Content.ReadFromJsonAsync<TmdbMovieDetails>(_jsonOptions);
            if (result == null)
            {
                throw new InvalidOperationException($"Failed to deserialize movie details for TMDB ID: {tmdbId}");
            }
            return result;
        }

        // Method to get now playing movies
        public async Task<TmdbMovieSearchResponse> GetNowPlayingMoviesAsync()
        {
            var response = await _httpClient.GetAsync($"movie/now_playing?api_key={_apiKey}");
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<TmdbMovieSearchResponse>(_jsonOptions);
            return result ?? new TmdbMovieSearchResponse(); // Return empty response if null
        }

        // Map from TMDB movie to our Movie model
        public Movie MapToMovie(TmdbMovieDetails tmdbMovie)
        {
            return new Movie
            {
                Title = tmdbMovie.Title,
                Description = tmdbMovie.Overview ?? string.Empty,
                PosterUrl = $"https://image.tmdb.org/t/p/w500{tmdbMovie.PosterPath}",
                Runtime = tmdbMovie.Runtime,
                Rating = tmdbMovie.Adult ? "R" : "PG-13", // This is a simplification
                ReleaseDate = tmdbMovie.ReleaseDate,
                TmdbId = tmdbMovie.Id
            };
        }

        // Add the GetMovieVideosAsync method inside the class
public async Task<MovieVideosResponse> GetMovieVideosAsync(int tmdbId)
{
    var response = await _httpClient.GetAsync($"movie/{tmdbId}/videos?api_key={_apiKey}");
    response.EnsureSuccessStatusCode();

    var result = await response.Content.ReadFromJsonAsync<MovieVideosResponse>(_jsonOptions);
    return result ?? new MovieVideosResponse(); // Return empty response if null
}
    }

    public class TmdbMovieSearchResponse
    {
        public int Page { get; set; }
        public List<TmdbMovie> Results { get; set; } = new List<TmdbMovie>();
        public int TotalPages { get; set; }
        public int TotalResults { get; set; }
    }

    public class TmdbMovie
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Overview { get; set; }
        public string? PosterPath { get; set; }
        public DateTime ReleaseDate { get; set; }
    }

    public class TmdbMovieDetails : TmdbMovie
    {
        public bool Adult { get; set; }
        public int Runtime { get; set; }
    }

    public class MovieVideosResponse
{
    public List<MovieVideo> Results { get; set; } = new List<MovieVideo>();
}

public class MovieVideo
{
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Site { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
}