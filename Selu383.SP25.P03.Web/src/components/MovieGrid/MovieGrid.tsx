import React from "react";
import { Movie } from "../../types/Movie";
import "./MovieGrid.css";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick }) => {
  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format rating (e.g., "PG-13")
  const formatRating = (rating: string) => {
    return rating || "NR"; // Default to "NR" (Not Rated) if empty
  };

  if (movies.length === 0) {
    return <div className="no-movies">No movies available</div>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onClick={() => onMovieClick(movie.id)}
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
            <div className="movie-rating">{formatRating(movie.rating)}</div>
          </div>
          <h3 className="movie-name">{movie.title}</h3>
          <p className="movie-info">
            {formatRuntime(movie.runtime)} •{" "}
            {new Date(movie.releaseDate).getFullYear()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
