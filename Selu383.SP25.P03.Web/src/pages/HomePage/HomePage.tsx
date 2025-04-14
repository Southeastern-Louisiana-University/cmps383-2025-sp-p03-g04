// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./HomePage.css";

// // Components
// import HeroSlider from "../../components/HeroSlider/HeroSlider";
// import Footer from "../../components/Footer/Footer";
// import MovieCarousel from "../../components/MovieCarousel/MovieCarousel";

// // Hooks
// import { useTheater } from "../../contexts/TheaterContext";

// // Types
// import { Movie } from "../../types/Movie";
// import { Showtime } from "../../types/Showtime";


// // Services
// import { getMovies } from "../../services/movieService";
// import { getShowtimesByTheater } from "../../services/showtimeService";

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { selectedTheater } = useTheater();
  
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [showtimes, setShowtimes] = useState<Showtime[]>([]);
//   const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
//   const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
//   const [newReleases, setNewReleases] = useState<Movie[]>([]);
//   const [comingSoon, setComingSoon] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch movies
//         const moviesData = await getMovies();
//         setMovies(moviesData);

//         // Fetch showtimes for the selected theater
//         if (selectedTheater) {
//           const theaterShowtimes = await getShowtimesByTheater(selectedTheater.id);
//           setShowtimes(theaterShowtimes);
//         }

//         // Categorize movies
//         if (moviesData.length > 0) {
//           // Featured movies (first 3 for slider)
//           setFeaturedMovies(moviesData.slice(0, 3));
          
//           // Popular movies (random selection of 8)
//           const shuffled = [...moviesData].sort(() => 0.5 - Math.random());
//           setPopularMovies(shuffled.slice(0, 8));
          
//           // New releases (movies with recent release dates, limit 8)
//           const sorted = [...moviesData].sort((a, b) => 
//             new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
//           );
//           setNewReleases(sorted.slice(0, 8));
          
//           // Coming soon (movies with future release dates, limit 8)
//           const today = new Date();
//           const future = moviesData.filter(movie => new Date(movie.releaseDate) > today);
//           setComingSoon(future.slice(0, 8));
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to fetch data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedTheater]);

//   // Handle movie click to navigate to details page with theater context
//   const handleMovieClick = (movieId: number) => {
//     // Pass the selected theater ID as a query parameter
//     navigate(`/movies/${movieId}${selectedTheater ? `?theaterId=${selectedTheater.id}` : ''}`);
//   };

//   // Loading state
//   if (loading) {
//     return <div className="loading-container">Loading...</div>;
//   }

//   // Error state
//   if (error) {
//     return <div className="error-container">{error}</div>;
//   }

//   return (
//     <div className="home-page">
//       {/* Hero Slider */}
//       <HeroSlider
//         movies={featuredMovies}
//         onBookNow={handleMovieClick}
//       />

//       {/* Now Playing Section */}
//       <section className="section movies">
//         <h2 className="section-title">Now Playing</h2>
//         <MovieCarousel 
//           movies={movies.filter(movie => {
//             // Filter movies that have showtimes for the selected theater
//             return showtimes.some(showtime => 
//               showtime.movieId === movie.id && 
//               showtime.theaterId === (selectedTheater?.id || 0)
//             );
//           })}
//           onMovieClick={handleMovieClick}
//         />
//       </section>
      
//       {/* Popular Movies Section */}
//       <section className="section movies">
//         <h2 className="section-title">Popular Movies</h2>
//         <MovieCarousel 
//           movies={popularMovies}
//           onMovieClick={handleMovieClick}
//         />
//       </section>
      
//       {/* New Releases Section */}
//       <section className="section movies">
//         <h2 className="section-title">New Releases</h2>
//         <MovieCarousel 
//           movies={newReleases}
//           onMovieClick={handleMovieClick}
//         />
//       </section>
      
//       {/* Coming Soon Section */}
//       <section className="section movies">
//         <h2 className="section-title">Coming Soon</h2>
//         <MovieCarousel 
//           movies={comingSoon}
//           onMovieClick={handleMovieClick}
//         />
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;


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
  const [showtimesByDate, setShowtimesByDate] = useState<Record<string, Showtime[]>>({});

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

        // Create date buckets
        const byDate: Record<string, Showtime[]> = {
          [today]: [],
          [tomorrowStr]: [],
        };

        // Fill the buckets
        allShowtimes.forEach((showtime) => {
          const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0];

          if (showtimeDate === today) {
            byDate[today].push(showtime);
          } else if (showtimeDate === tomorrowStr) {
            byDate[tomorrowStr].push(showtime);
          }
        });

        setShowtimesByDate(byDate);

        // Set showtimes based on selected date
        setShowtimes(selectedDate === "today" ? byDate[today] : byDate[tomorrowStr]);
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