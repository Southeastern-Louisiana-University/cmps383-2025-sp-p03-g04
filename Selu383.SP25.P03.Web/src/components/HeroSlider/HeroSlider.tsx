import React, { useState, useEffect } from "react";
import { Movie } from "../../types/Movie";
import { getMovieVideos } from "../../services/movieService";
import "./HeroSlider.css";

interface HeroSliderProps {
  movies: Movie[];
  onBookNow: (movieId: number) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies, onBookNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide change
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  // Slide navigation
  const nextSlide = () => {
    if (movies.length === 0) return;
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (movies.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  // Play trailer
  const playTrailer = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();

    try {
      const videoData = await getMovieVideos(movieId);

      if (videoData && videoData.results && videoData.results.length > 0) {
        const trailer = videoData.results.find(
          (video: any) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          window.open(
            `https://www.youtube.com/watch?v=${trailer.key}`,
            "_blank"
          );
        } else {
          alert("No trailer available for this movie");
        }
      } else {
        alert("No videos available for this movie");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("Failed to load trailer");
    }
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="hero-slider">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url(${movie.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <div className="content-box">
              <span className="universe">FEATURED MOVIE</span>
              <h1 className="movie-title">{movie.title}</h1>
              <p className="movie-overview">
                {movie.description.length > 150
                  ? `${movie.description.substring(0, 150)}...`
                  : movie.description}
              </p>
              <div className="actions">
                <button
                  className="btn book-now"
                  onClick={() => onBookNow(movie.id)}
                >
                  BOOK NOW
                </button>
                <button
                  className="btn-play"
                  onClick={(e) => playTrailer(e, movie.id)}
                >
                  <i className="play-icon">▶</i>
                  <span>TRAILER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider controls */}
      <button className="slider-control prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="slider-control next" onClick={nextSlide}>
        ❯
      </button>

      {/* Slider pagination */}
      <div className="slider-pagination">
        {movies.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
