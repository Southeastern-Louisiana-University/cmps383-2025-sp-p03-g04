import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// Components
import HeroSlider from "../../components/HeroSlider/HeroSlider";
import TheaterSelector from "../../components/TheaterSelector/TheaterSelector";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import Footer from "../../components/Footer/Footer";

// Types
import { Theater } from "../../types/Theater";
import { Movie } from "../../types/Movie";

// Services
import { getTheaters } from "../../services/theaterService";
import { getMovies } from "../../services/movieService";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch theaters
        const theatersData = await getTheaters();
        setTheaters(theatersData);

        if (theatersData.length > 0) {
          setSelectedTheater(theatersData[0]);
        }

        // Fetch movies
        const moviesData = await getMovies();
        setMovies(moviesData);

        // Set featured movies (first 3 for slider, first 12 for grid)
        setFeaturedMovies(moviesData.slice(0, 12));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
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
        movies={movies.slice(0, 3)}
        onBookNow={(movieId) => navigate(`/movies/${movieId}`)}
      />

      {/* Theaters Section */}
      <section className="section theaters-section">
        <h2 className="section-title">Theaters</h2>
        <TheaterSelector
          theaters={theaters}
          selectedTheater={selectedTheater}
          onSelectTheater={handleTheaterSelect}
        />
      </section>

      {/* Available This Week */}
      <section className="section movies">
        <h2 className="section-title">Available This Week</h2>
        <MovieGrid
          movies={featuredMovies}
          onMovieClick={(movieId) => navigate(`/movies/${movieId}`)}
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
