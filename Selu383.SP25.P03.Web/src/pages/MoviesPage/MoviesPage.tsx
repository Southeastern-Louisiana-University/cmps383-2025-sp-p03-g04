import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types/Movie";
import { getMovies } from "../../services/movieService";
import Footer from "../../components/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./MoviesPage.css";

const commonGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Western",
  "Family",
];

const extractGenres = (movie: Movie): string[] => {
  const text = `${movie.title} ${movie.description}`.toLowerCase();

  // Match genres in the text
  return commonGenres.filter(
    (genre) =>
      text.includes(genre.toLowerCase()) ||
      // Special case for "Sci-Fi" which could appear as "Science Fiction"
      (genre === "Science Fiction" && text.includes("sci-fi"))
  );
};

const MoviesPage: React.FC = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [availableGenres, setAvailableGenres] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all movies
        const moviesData = await getMovies();
        setMovies(moviesData);

        const genresSet = new Set<string>();
        genresSet.add("All"); // Always include "All" option

        // Extract rating categories as additional "genres"
        moviesData.forEach((movie) => {
          if (movie.rating) {
            genresSet.add(`Rating: ${movie.rating}`);
          }

          // Extract content-based genres
          extractGenres(movie).forEach((genre) => genresSet.add(genre));
        });

        // Sort genres alphabetically, but keep "All" at the top
        const sortedGenres = [...genresSet].sort((a, b) => {
          if (a === "All") return -1;
          if (b === "All") return 1;
          return a.localeCompare(b);
        });

        setAvailableGenres(sortedGenres);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter movies based on search term and selected genre only
  useEffect(() => {
    let result = movies;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre (if not "All")
    if (selectedGenre !== "All") {
      if (selectedGenre.startsWith("Rating: ")) {
        // Handle rating filters
        const rating = selectedGenre.replace("Rating: ", "");
        result = result.filter((movie) => movie.rating === rating);
      } else {
        // Handle content-based genre filters
        result = result.filter((movie) => {
          const movieGenres = extractGenres(movie);
          return movieGenres.includes(selectedGenre);
        });
      }
    }

    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, movies]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>All Movies</h1>

        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="genre-filter">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {availableGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="no-results">
          <p>No movies found matching your criteria.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="movie-image">
                <img
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/placeholder-poster.jpg";
                  }}
                />
                <div className="movie-rating">{movie.rating || "NR"}</div>
              </div>
              <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-info">
                  {formatRuntime(movie.runtime)} •{" "}
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
                {/* Description was removed */}
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
      <ThemeToggle size={40} position="bottomRight" />
    </div>
  );
};

export default MoviesPage;
