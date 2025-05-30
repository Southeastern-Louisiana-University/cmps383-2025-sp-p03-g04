import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Movie } from "../../types/Movie";
import { Showtime } from "../../types/Showtime";
import { Theater } from "../../types/Theater";
import { getMovie } from "../../services/movieService";
import { getShowtimesByMovie } from "../../services/showtimeService";
import { getTheater } from "../../services/theaterService";
import { useTheater } from "../../contexts/TheaterContext";
import Footer from "../../components/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./MovieDetailsPage.css";

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const theaterId = queryParams.get("theaterId");
  const { selectedTheater } = useTheater();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [displayTheater, setDisplayTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("today");

  const openYouTubeTrailer = () => {
    if (movie && movie.title) {
      const searchQuery = movie.releaseDate
        ? `${movie.title} ${new Date(
            movie.releaseDate
          ).getFullYear()} official trailer`
        : `${movie.title} official trailer`;

      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          searchQuery
        )}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const movieId = parseInt(id);
        const movieData = await getMovie(movieId);
        setMovie(movieData);

        let theaterToUse = selectedTheater;

        if (theaterId) {
          try {
            const theaterData = await getTheater(parseInt(theaterId));
            setDisplayTheater(theaterData);
            theaterToUse = theaterData;
          } catch (theaterError) {
            console.error("Error fetching theater:", theaterError);
            setDisplayTheater(selectedTheater);
          }
        } else if (selectedTheater) {
          setDisplayTheater(selectedTheater);
        } else {
          setError("Please select a theater to view showtimes");
          setLoading(false);
          return;
        }

        if (theaterToUse) {
          const showtimesData = await getShowtimesByMovie(movieId);
          const filteredShowtimes = showtimesData.filter(
            (st) => st.theaterId === theaterToUse?.id
          );
          setShowtimes(filteredShowtimes);
        }
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to fetch movie data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, theaterId, selectedTheater]);

  useEffect(() => {
    if (showTrailerModal) {
      document.body.style.overflow = "hidden";

      const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeTrailerModal();
        }
      };

      window.addEventListener("keydown", handleEscKey);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [showTrailerModal]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBD";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const groupedShowtimesByDate = showtimes.reduce<Record<string, Showtime[]>>(
    (acc, showtime) => {
      const date = new Date(showtime.startTime).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(showtime);
      return acc;
    },
    {}
  );

  const dateOptions = Object.keys(groupedShowtimesByDate)
    .map((dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = date.getTime() === today.getTime();
      const isTomorrow = date.getTime() === tomorrow.getTime();

      let display;
      if (isToday) {
        display = "Today";
      } else if (isTomorrow) {
        display = "Tomorrow";
      } else {
        display = date.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }

      return { date: dateString, display };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatShowtime = (datetime: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleTimeString(undefined, options);
  };

  const handleBookShowtime = (showtimeId: number) => {
    navigate(`/booking/${showtimeId}`);
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="loading-container">Loading movie details...</div>;
  }

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
      <div
        className="movie-hero"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}>
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
                  }}>
                  BOOK TICKETS
                </button>

                <button className="btn-play" onClick={openYouTubeTrailer}>
                  <i className="play-icon">▶</i>
                  <span>WATCH TRAILER</span>
                </button>
              </div>

              <div className="movie-synopsis">
                <h3>Synopsis</h3>
                <p>{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="showtimes" className="showtimes-section">
        <h2 className="section-title">Showtimes</h2>

        {displayTheater && (
          <div className="selected-theater-info">
            <h3>{displayTheater.name}</h3>
            <p className="theater-address">{displayTheater.address}</p>
          </div>
        )}

        {dateOptions.length > 0 && (
          <div className="date-tabs">
            {dateOptions.map((dateOption) => (
              <button
                key={dateOption.date}
                className={`date-tab ${
                  selectedDate === dateOption.date ? "active" : ""
                }`}
                onClick={() => setSelectedDate(dateOption.date)}>
                {dateOption.display}
              </button>
            ))}
          </div>
        )}

        {dateOptions.length === 0 ? (
          <div className="no-showtimes">
            <p>
              No showtimes available for this movie at{" "}
              {displayTheater?.name || "the selected theater"}.
            </p>
            <button className="btn return-home" onClick={handleReturnHome}>
              Return to Home Page
            </button>
          </div>
        ) : (
          <div className="showtimes-container">
            {groupedShowtimesByDate[selectedDate] ? (
              <div className="date-showtimes">
                <div className="times-grid">
                  {groupedShowtimesByDate[selectedDate]
                    .sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                    )
                    .map((showtime) => (
                      <button
                        key={showtime.id}
                        className="time-slot"
                        onClick={() => handleBookShowtime(showtime.id)}>
                        {formatShowtime(showtime.startTime)}
                        <span className="time-price">
                          ${showtime.ticketPrice.toFixed(2)}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="no-showtimes">
                <p>
                  No showtimes available for{" "}
                  {new Date(selectedDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>Please select another date</p>
              </div>
            )}
          </div>
        )}
      </section>

      <ThemeToggle position="bottomRight" />
      <Footer />
    </div>
  );
};

export default MovieDetailsPage;
