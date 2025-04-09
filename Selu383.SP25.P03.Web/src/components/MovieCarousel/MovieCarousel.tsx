import React, { useRef } from "react";
import { Movie } from "../../types/Movie";
import "./MovieCarousel.css";

interface MovieCarouselProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, onMovieClick }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Scroll carousel left
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll carousel right
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (movies.length === 0) {
    return <div className="no-movies">No movies available</div>;
  }

  return (
    <div className="movie-carousel-container">
      <button className="carousel-arrow left" onClick={scrollLeft} aria-label="Scroll left">
        ❮
      </button>
      
      <div className="movie-carousel" ref={carouselRef}>
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
            <div className="movie-text-container">
              <h3 className="movie-name" title={movie.title}>{movie.title}</h3>
              <p className="movie-info">
                {formatRuntime(movie.runtime)} • {new Date(movie.releaseDate).getFullYear()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-arrow right" onClick={scrollRight} aria-label="Scroll right">
        ❯
      </button>
    </div>
  );
};

export default MovieCarousel;