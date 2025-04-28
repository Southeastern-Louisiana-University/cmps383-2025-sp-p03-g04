import React, { useState, useEffect } from "react";
import "./ManagerDashboardPage.css";

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  genre: string;
  rating: string;
  posterPath: string;
  status: string;
}

interface Showtime {
  id: number;
  movieId: number;
  date: string;
  time: string;
  theater: string;
  capacity: {
    booked: number;
    total: number;
  };
  status: string;
}

const MovieManager: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 1,
      title: "Dune: Part Two",
      description:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      duration: 166,
      genre: "Action",
      rating: "PG-13",
      posterPath: "/images/dune-part-two.jpg",
      status: "Active",
    },
  ]);

  const [showtimes, setShowtimes] = useState<Showtime[]>([
    {
      id: 1,
      movieId: 1,
      date: "Mar 15, 2025",
      time: "14:30",
      theater: "Theater 1",
      capacity: {
        booked: 120,
        total: 150,
      },
      status: "Active",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movies[0]);

  const [movieTitle, setMovieTitle] = useState("");
  const [movieDuration, setMovieDuration] = useState(0);
  const [movieDescription, setMovieDescription] = useState("");
  const [movieGenre, setMovieGenre] = useState("Action");
  const [movieRating, setMovieRating] = useState("G");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Showtime modal state
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [newShowtimeDate, setNewShowtimeDate] = useState("");
  const [newShowtimeTime, setNewShowtimeTime] = useState("");
  const [newShowtimeTheater, setNewShowtimeTheater] = useState("");
  const [newShowtimeCapacity, setNewShowtimeCapacity] = useState(150);

  useEffect(() => {
    if (selectedMovie) {
      setMovieTitle(selectedMovie.title);
      setMovieDuration(selectedMovie.duration);
      setMovieDescription(selectedMovie.description);
      setMovieGenre(selectedMovie.genre);
      setMovieRating(selectedMovie.rating);
    }
  }, [selectedMovie]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setPosterPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMovie = () => {
    const newMovie: Movie = {
      id: movies.length + 1,
      title: "New Movie",
      description: "",
      duration: 120,
      genre: "Action",
      rating: "PG-13",
      posterPath: "",
      status: "Active",
    };

    setMovies([...movies, newMovie]);
    setSelectedMovie(newMovie);
  };

  const handleDeleteShowtime = (id: number) => {
    setShowtimes(showtimes.filter((showtime) => showtime.id !== id));
  };

  const handleSaveMovie = () => {
    if (!selectedMovie) return;

    const updatedMovie = {
      ...selectedMovie,
      title: movieTitle,
      duration: movieDuration,
      description: movieDescription,
      genre: movieGenre,
      rating: movieRating,
      posterPath: posterPreview || selectedMovie.posterPath,
    };

    setMovies(
      movies.map((movie) =>
        movie.id === selectedMovie.id ? updatedMovie : movie
      )
    );

    setSelectedMovie(updatedMovie);
    alert("Movie details saved successfully!");
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShowtimes = selectedMovie
    ? showtimes.filter((showtime) => showtime.movieId === selectedMovie.id)
    : [];

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <i className="fas fa-film"></i>
          <span>Movie Manager Dashboard</span>
        </div>
        <button className="add-movie-btn" onClick={handleAddMovie}>
          <i className="fas fa-plus"></i>
          Add New Movie
        </button>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul className="movie-list">
            {filteredMovies.map((movie) => (
              <li
                key={movie.id}
                className={`movie-item ${
                  selectedMovie && movie.id === selectedMovie.id ? "active" : ""
                }`}
                onClick={() => handleSelectMovie(movie)}>
                <div className="movie-thumbnail">
                  {movie.posterPath ? (
                    <img src={movie.posterPath} alt={movie.title} />
                  ) : (
                    <div
                      style={{
                        background: "#3d3f4a",
                        width: "100%",
                        height: "100%",
                      }}></div>
                  )}
                </div>
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-status">{movie.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="content-area">
          {selectedMovie ? (
            <>
              <div className="movie-editor">
                <div className="editor-grid">
                  <div className="poster-upload">
                    <input
                      type="file"
                      id="poster-upload"
                      style={{ display: "none" }}
                      onChange={handlePosterUpload}
                      accept="image/*"
                    />
                    <label
                      htmlFor="poster-upload"
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {posterPreview || selectedMovie.posterPath ? (
                        <img
                          src={posterPreview || selectedMovie.posterPath}
                          alt={selectedMovie.title}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt"></i>
                          <p>Drop poster here or click to upload</p>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="editor-form">
                    <div className="form-group">
                      <label>Movie Title</label>
                      <input
                        type="text"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration (mins)</label>
                      <input
                        type="number"
                        value={movieDuration}
                        onChange={(e) =>
                          setMovieDuration(parseInt(e.target.value))
                        }
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={movieDescription}
                        onChange={(e) =>
                          setMovieDescription(e.target.value)
                        }></textarea>
                    </div>

                    <div className="form-group">
                      <label>Genre</label>
                      <select
                        value={movieGenre}
                        onChange={(e) => setMovieGenre(e.target.value)}>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Horror">Horror</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Rating</label>
                      <select
                        value={movieRating}
                        onChange={(e) => setMovieRating(e.target.value)}>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                      </select>
                    </div>

                    <div
                      className="form-group full-width"
                      style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveMovie}>
                        <i className="fas fa-save"></i> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="showtime-section">
                <div className="section-header">
                  <h2 className="section-title">Showtime Management</h2>
                  <div className="action-buttons">
                    <button className="btn btn-outline">
                      <i className="fas fa-copy"></i>
                      Bulk Copy
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsShowtimeModalOpen(true)}>
                      <i className="fas fa-plus"></i>
                      Add Showtime
                    </button>
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Theater</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredShowtimes.map((showtime) => (
                        <tr key={showtime.id}>
                          <td>{showtime.date}</td>
                          <td>{showtime.time}</td>
                          <td>{showtime.theater}</td>
                          <td>
                            {showtime.capacity.booked}/{showtime.capacity.total}
                          </td>
                          <td>
                            <span className="status-badge status-active">
                              {showtime.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-icons">
                              <i className="fas fa-edit action-icon"></i>
                              <i
                                className="fas fa-trash-alt action-icon"
                                onClick={() =>
                                  handleDeleteShowtime(showtime.id)
                                }></i>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {isShowtimeModalOpen && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <h3>Add New Showtime</h3>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={newShowtimeDate}
                        onChange={(e) => setNewShowtimeDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={newShowtimeTime}
                        onChange={(e) => setNewShowtimeTime(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Theater</label>
                      <input
                        type="text"
                        value={newShowtimeTheater}
                        onChange={(e) => setNewShowtimeTheater(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Capacity</label>
                      <input
                        type="number"
                        value={newShowtimeCapacity}
                        onChange={(e) =>
                          setNewShowtimeCapacity(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="modal-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => setIsShowtimeModalOpen(false)}>
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (!selectedMovie) return;

                          const newShowtime: Showtime = {
                            id: showtimes.length + 1,
                            movieId: selectedMovie.id,
                            date: new Date(newShowtimeDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            ),
                            time: newShowtimeTime,
                            theater: newShowtimeTheater,
                            capacity: {
                              booked: 0,
                              total: newShowtimeCapacity,
                            },
                            status: "Active",
                          };

                          setShowtimes([...showtimes, newShowtime]);
                          setIsShowtimeModalOpen(false);

                          setNewShowtimeDate("");
                          setNewShowtimeTime("");
                          setNewShowtimeTheater("");
                          setNewShowtimeCapacity(150);
                        }}>
                        Add Showtime
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>Select a movie or add a new one to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieManager;
