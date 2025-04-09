import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// Components
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import Footer from "../../components/Footer/Footer";
import MovieCarousel from "../../components/MovieCarousel/MovieCarousel";

// Hooks
import { useTheater } from "../../contexts/TheaterContext";

// Types
import { Movie } from "../../types/Movie";
import { Showtime } from "../../types/Showtime";


// Services
import { getMovies } from "../../services/movieService";
import { getShowtimesByTheater } from "../../services/showtimeService";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTheater } = useTheater();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch movies
        const moviesData = await getMovies();
        setMovies(moviesData);

        // Fetch showtimes for the selected theater
        if (selectedTheater) {
          const theaterShowtimes = await getShowtimesByTheater(selectedTheater.id);
          setShowtimes(theaterShowtimes);
        }

        // Categorize movies
        if (moviesData.length > 0) {
          // Featured movies (first 3 for slider)
          setFeaturedMovies(moviesData.slice(0, 3));
          
          // Popular movies (random selection of 8)
          const shuffled = [...moviesData].sort(() => 0.5 - Math.random());
          setPopularMovies(shuffled.slice(0, 8));
          
          // New releases (movies with recent release dates, limit 8)
          const sorted = [...moviesData].sort((a, b) => 
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          );
          setNewReleases(sorted.slice(0, 8));
          
          // Coming soon (movies with future release dates, limit 8)
          const today = new Date();
          const future = moviesData.filter(movie => new Date(movie.releaseDate) > today);
          setComingSoon(future.slice(0, 8));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTheater]);

  // Handle movie click to navigate to details page with theater context
  const handleMovieClick = (movieId: number) => {
    // Pass the selected theater ID as a query parameter
    navigate(`/movies/${movieId}${selectedTheater ? `?theaterId=${selectedTheater.id}` : ''}`);
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <HeroSlider
        movies={featuredMovies}
        onBookNow={handleMovieClick}
      />

      {/* Now Playing Section */}
      <section className="section movies">
        <h2 className="section-title">Now Playing</h2>
        <MovieCarousel 
          movies={movies.filter(movie => {
            // Filter movies that have showtimes for the selected theater
            return showtimes.some(showtime => 
              showtime.movieId === movie.id && 
              showtime.theaterId === (selectedTheater?.id || 0)
            );
          })}
          onMovieClick={handleMovieClick}
        />
      </section>
      
      {/* Popular Movies Section */}
      <section className="section movies">
        <h2 className="section-title">Popular Movies</h2>
        <MovieCarousel 
          movies={popularMovies}
          onMovieClick={handleMovieClick}
        />
      </section>
      
      {/* New Releases Section */}
      <section className="section movies">
        <h2 className="section-title">New Releases</h2>
        <MovieCarousel 
          movies={newReleases}
          onMovieClick={handleMovieClick}
        />
      </section>
      
      {/* Coming Soon Section */}
      <section className="section movies">
        <h2 className="section-title">Coming Soon</h2>
        <MovieCarousel 
          movies={comingSoon}
          onMovieClick={handleMovieClick}
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;