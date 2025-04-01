import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../../types/Movie";
import { Showtime } from "../../types/Showtime";
import { getMovie, getMovieVideos } from "../../services/movieService";
import { getShowtimesByMovie } from "../../services/showtimeService";
import Footer from "../../components/Footer/Footer";
import "./MovieDetailsPage.css";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch movie details
        const movieId = parseInt(id);
        const movieData = await getMovie(movieId);
        setMovie(movieData);

        // Fetch showtimes for this movie
        const showtimesData = await getShowtimesByMovie(movieId);
        setShowtimes(showtimesData);

        // Try to fetch trailer
        try {
          const videosData = await getMovieVideos(movieId);
          if (
            videosData &&
            videosData.results &&
            videosData.results.length > 0
          ) {
            const trailerVideo = videosData.results.find(
              (video: any) =>
                video.type === "Trailer" && video.site === "YouTube"
            );

            if (trailerVideo) {
              setTrailer(`https://www.youtube.com/embed/${trailerVideo.key}`);
            }
          }
        } catch (videoError) {
          console.error("Error fetching trailer:", videoError);
          // We don't need to set error state for trailer issues
        }
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to fetch movie data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

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

  // Group showtimes by theater and date
  const groupedShowtimes = showtimes.reduce<
    Record<string, Record<string, Showtime[]>>
  >((acc, showtime) => {
    const theaterName = showtime.theaterName;
    const date = new Date(showtime.startTime).toLocaleDateString();

    if (!acc[theaterName]) {
      acc[theaterName] = {};
    }

    if (!acc[theaterName][date]) {
      acc[theaterName][date] = [];
    }

    acc[theaterName][date].push(showtime);
    return acc;
  }, {});

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

  // Handle play trailer
  const handlePlayTrailer = () => {
    if (trailer) {
      document.getElementById("trailer-modal")?.classList.add("active");
    } else {
      alert("No trailer available for this movie");
    }
  };

  // Close trailer modal
  const closeTrailerModal = () => {
    document.getElementById("trailer-modal")?.classList.remove("active");

    // Stop video playback
    const iframe = document.querySelector(
      ".trailer-iframe"
    ) as HTMLIFrameElement;
    if (iframe && iframe.src) {
      iframe.src = iframe.src;
    }
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state
  if (error || !movie) {
    return <div className="error-container">{error || "Movie not found"}</div>;
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

                {trailer && (
                  <button className="btn-play" onClick={handlePlayTrailer}>
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

        {Object.keys(groupedShowtimes).length === 0 ? (
          <div className="no-showtimes">
            <p>No showtimes available for this movie.</p>
          </div>
        ) : (
          <div className="theaters-container">
            {Object.entries(groupedShowtimes).map(
              ([theater, dateShowtimes]) => (
                <div key={theater} className="theater-showtimes">
                  <h3 className="theater-name">{theater}</h3>

                  {Object.entries(dateShowtimes).map(([date, showtimes]) => (
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
              )
            )}
          </div>
        )}
      </section>

      {/* Trailer modal */}
      {trailer && (
        <div id="trailer-modal" className="trailer-modal">
          <div className="trailer-modal-content">
            <button className="close-modal" onClick={closeTrailerModal}>
              ✕
            </button>
            <iframe
              className="trailer-iframe"
              src={trailer}
              title={`${movie.title} Trailer`}
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
