import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheater } from "../../contexts/TheaterContext";
import Footer from "../../components/Footer/Footer";
import TheaterSelector from "../../components/TheaterSelector/TheaterSelector";
import MovieCarousel from "../../components/MovieCarousel/MovieCarousel";
import TypewriterBanner from "../../components/TypewriterBanner/TypewriterBanner";
import { Movie } from "../../types/Movie";
import { Theater } from "../../types/Theater";
import { Showtime } from "../../types/Showtime";
import { getMovies } from "../../services/movieService";
import { getTheaters } from "../../services/theaterService";
import { getShowtimesByTheater } from "../../services/showtimeService";
import "./HomePage1.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTheater, setSelectedTheater } = useTheater();
  
  // State variables
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("today");
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch movies
        const moviesData = await getMovies();
        setMovies(moviesData);

        // Fetch theaters
        const theatersData = await getTheaters();
        setTheaters(theatersData);
        
        // Set first theater as selected if none is selected
        if (!selectedTheater && theatersData.length > 0) {
          setSelectedTheater(theatersData[0]);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTheater, setSelectedTheater]);

  // Load showtimes when selected theater changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedTheater) return;
      
      try {
        const allShowtimes = await getShowtimesByTheater(selectedTheater.id);
        
        // Organize showtimes by date
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        // Filter showtimes based on selected date
        if (selectedDate === "today") {
          const todaysShowtimes = allShowtimes.filter(showtime => {
            const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0];
            return showtimeDate === today;
          });
          setShowtimes(todaysShowtimes);
        } else {
          const tomorrowsShowtimes = allShowtimes.filter(showtime => {
            const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0];
            return showtimeDate === tomorrowStr;
          });
          setShowtimes(tomorrowsShowtimes);
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [selectedTheater, selectedDate]);

  // Handle movie click
  const handleMovieClick = (movieId: number) => {
    navigate(`/movies/${movieId}${selectedTheater ? `?theaterId=${selectedTheater.id}` : ''}`);
  };

  // Handle showtime click
  const handleShowtimeClick = (showtimeId: number) => {
    navigate(`/booking/${showtimeId}`);
  };

  // Handle theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
  };

  // Group showtimes by movie
  const showtimesByMovie = showtimes.reduce<Record<number, Showtime[]>>((acc, showtime) => {
    if (!acc[showtime.movieId]) {
      acc[showtime.movieId] = [];
    }
    
    acc[showtime.movieId].push(showtime);
    return acc;
  }, {});

  // Format time for display
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-banner">
            <TypewriterBanner />
          </div>
          
          <h1 className="welcome-heading">Welcome to Lion's Den Cinemas</h1>
          
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate('/movies')}>
              <i className="action-icon">🎬</i>
              Browse Movies
            </button>
            <button className="action-btn" onClick={() => navigate('/tickets')}>
              <i className="action-icon">🎟️</i>
              My Tickets
            </button>
            <button className="action-btn" onClick={() => navigate('/concessions')}>
              <i className="action-icon">🍿</i>
              Order Food
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Select Theater</h2>
        <TheaterSelector
          theaters={theaters}
          selectedTheater={selectedTheater}
          onSelectTheater={handleTheaterSelect}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Now Playing</h2>
        <MovieCarousel movies={movies} onMovieClick={handleMovieClick} />
      </section>

      <section className="section">
        <h2 className="section-title">Showtimes</h2>
        
        <div className="date-tabs">
          <button 
            className={`date-tab ${selectedDate === 'today' ? 'active' : ''}`}
            onClick={() => setSelectedDate('today')}
          >
            Today
          </button>
          <button 
            className={`date-tab ${selectedDate === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setSelectedDate('tomorrow')}
          >
            Tomorrow
          </button>
        </div>

        <div className="showtimes-container">
          {Object.keys(showtimesByMovie).length > 0 ? (
            Object.entries(showtimesByMovie).map(([movieId, movieShowtimes]) => {
              // Find movie details
              const movie = movies.find(m => m.id === parseInt(movieId));
              if (!movie) return null;

              return (
                <div className="movie-showtimes" key={movieId}>
                  <div className="movie-showtime-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="runtime">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                      <span className="separator">•</span>
                      <span className="rating">{movie.rating}</span>
                    </div>
                  </div>
                  
                  <div className="showtime-buttons">
                    {movieShowtimes.map(showtime => (
                      <button 
                        key={showtime.id} 
                        className="showtime-btn"
                        onClick={() => handleShowtimeClick(showtime.id)}
                      >
                        {formatTime(showtime.startTime)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-showtimes">
              <p>No showtimes available for {selectedDate === 'today' ? 'today' : 'tomorrow'}</p>
              <p>Please select another date or theater</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;