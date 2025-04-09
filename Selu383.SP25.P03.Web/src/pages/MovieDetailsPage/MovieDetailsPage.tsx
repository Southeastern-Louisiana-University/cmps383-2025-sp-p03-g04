import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Movie } from "../../types/Movie";
import { Showtime } from "../../types/Showtime";
import { Theater } from "../../types/Theater";
import { getMovie, getMovieVideos } from "../../services/movieService";
import { getShowtimesByMovie } from "../../services/showtimeService";
import { getTheater } from "../../services/theaterService";
import Footer from "../../components/Footer/Footer";
import "./MovieDetailsPage.css";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const theaterId = queryParams.get('theaterId');
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  
  // Reference for the trailer modal
  const trailerModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch movie details
        const movieId = parseInt(id);
        const movieData = await getMovie(movieId);
        setMovie(movieData);

        // Check if a theater is specified in the URL
        if (!theaterId) {
          // If no theater is specified, redirect back to home page to select a theater
          setError("Please select a theater from the home page first.");
          return;
        }
        
        // Fetch the selected theater information
        try {
          const theaterData = await getTheater(parseInt(theaterId));
          setSelectedTheater(theaterData);
          
          // Fetch showtimes for this movie and theater
          const showtimesData = await getShowtimesByMovie(movieId);
          const filteredShowtimes = showtimesData.filter(
            st => st.theaterId === theaterData.id
          );
          setShowtimes(filteredShowtimes);
        } catch (theaterError) {
          console.error("Error fetching theater:", theaterError);
          setError("The selected theater could not be found. Please return to the home page to select a theater.");
          return;
        }

        // Try to fetch trailer
        try {
          console.log("Fetching trailer for movie ID:", movieId);
          const videosData = await getMovieVideos(movieId);
          console.log("Video data received:", videosData);

          if (videosData && videosData.results && videosData.results.length > 0) {
            // Look for an official trailer first
            let trailerVideo = videosData.results.find(
              (video: any) => video.type === "Trailer" && video.site === "YouTube"
            );
            
            // If no trailer is found, look for any YouTube video
            if (!trailerVideo) {
              trailerVideo = videosData.results.find((video: any) => video.site === "YouTube");
            }
            
            if (trailerVideo) {
              console.log("Found trailer with key:", trailerVideo.key);
              setTrailerKey(trailerVideo.key);
            } else {
              console.log("No suitable trailer found in results");
            }
          } else {
            console.log("No video results found");
          }
        } catch (videoError) {
          console.error("Error fetching trailer:", videoError);
          // We don't set error state for trailer issues
        }
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to fetch movie data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, theaterId, navigate]);
  
  // Handle body scrolling when modal is open
  useEffect(() => {
    if (trailerModalOpen) {
      // Disable body scrolling
      document.body.style.overflow = 'hidden';
      
      // Add event listener for escape key
      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeTrailerModal();
        }
      };
      
      window.addEventListener('keydown', handleEscKey);
      
      // Cleanup
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscKey);
      };
    } else {
      // Re-enable body scrolling
      document.body.style.overflow = '';
    }
  }, [trailerModalOpen]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBD";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Group showtimes by date
  const groupedShowtimesByDate = showtimes.reduce<Record<string, Showtime[]>>(
    (acc, showtime) => {
      const date = new Date(showtime.startTime).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(showtime);
      return acc;
    }, {}
  );

  // Format showtime
  const formatShowtime = (datetime: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleTimeString(undefined, options);
  };

  // Handle booking
  const handleBookShowtime = (showtimeId: number) => {
    navigate(`/booking/${showtimeId}`);
  };

  // Open trailer modal
  const openTrailerModal = () => {
    setTrailerModalOpen(true);
  };

  // Close trailer modal
  const closeTrailerModal = () => {
    setTrailerModalOpen(false);
  };

  // Handle background click to close modal
  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (trailerModalRef.current === e.target) {
      closeTrailerModal();
    }
  };

  // Handle returning to home page
  const handleReturnHome = () => {
    navigate('/');
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="error-container">
        <p>{error || "Movie not found"}</p>
        <button className="btn return-home" onClick={handleReturnHome}>
          Return to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      {/* Movie hero section */}
      <div
        className="movie-hero"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      >
        <div className="movie-hero-overlay"></div>
        <div className="movie-hero-content">
          <div className="movie-info-container">
            <div className="movie-poster">
              <img
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder-poster.jpg";
                }}
              />
            </div>

            <div className="movie-info">
              <h1 className="movie-title">{movie.title}</h1>

              <div className="movie-meta">
                <span className="movie-rating">{movie.rating}</span>
                <span className="movie-runtime">
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="movie-release">
                  {formatDate(movie.releaseDate)}
                </span>
              </div>

              <div className="movie-actions">
                <button
                  className="btn book-now"
                  onClick={() => {
                    const showtimeSection =
                      document.getElementById("showtimes");
                    if (showtimeSection) {
                      showtimeSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  BOOK TICKETS
                </button>

                {trailerKey && (
                  <button className="btn-play" onClick={openTrailerModal}>
                    <i className="play-icon">▶</i>
                    <span>WATCH TRAILER</span>
                  </button>
                )}
              </div>

              <div className="movie-synopsis">
                <h3>Synopsis</h3>
                <p>{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes section */}
      <section id="showtimes" className="showtimes-section">
        <h2 className="section-title">Showtimes</h2>
        
        {/* Show selected theater heading */}
        {selectedTheater && (
          <div className="selected-theater-info">
            <h3> {selectedTheater.name}</h3>
            <p className="theater-address">{selectedTheater.address}</p>
          </div>
        )}

        {Object.keys(groupedShowtimesByDate).length === 0 ? (
          <div className="no-showtimes">
            <p>No showtimes available for this movie at {selectedTheater?.name || 'the selected theater'}.</p>
            <button className="btn return-home" onClick={handleReturnHome}>
              Return to Home Page
            </button>
          </div>
        ) : (
          <div className="showtimes-container">
            {Object.entries(groupedShowtimesByDate).map(([date, showtimes]) => (
              <div key={date} className="date-showtimes">
                <h4 className="date">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>

                <div className="times-grid">
                  {showtimes
                    .sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    )
                    .map((showtime) => (
                      <button
                        key={showtime.id}
                        className="time-slot"
                        onClick={() => handleBookShowtime(showtime.id)}
                      >
                        {formatShowtime(showtime.startTime)}
                        <span className="time-price">
                          ${showtime.ticketPrice.toFixed(2)}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* YouTube Trailer Modal */}
      {trailerModalOpen && trailerKey && (
        <div 
          className="trailer-modal" 
          ref={trailerModalRef}
          onClick={handleModalBackgroundClick}
        >
          <div className="trailer-container">
            <button className="close-trailer" onClick={closeTrailerModal}>
              ✕
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MovieDetails;