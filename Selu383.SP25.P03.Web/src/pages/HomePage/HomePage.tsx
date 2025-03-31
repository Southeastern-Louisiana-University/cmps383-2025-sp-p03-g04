import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// Define types
interface Theater {
  id: number;
  name: string;
  location: string;
  screens: number;
}

interface Slide {
  id: number;
  backdropPath: string;
  title: string;
  overview: string;
  path: string;
}

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
  runtime?: number; // Added runtime property
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
}

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// Image utilities
const getPosterUrl = (path: string, size = 'w500') => {
  if (!path) return '/images/placeholder-poster.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const getBackdropUrl = (path: string, size = 'original') => {
  if (!path) return '/images/placeholder-backdrop.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredSlides, setFeaturedSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theater locations
  const theaters: Theater[] = [
    { id: 1, name: "Downtown", location: "New York", screens: 10 },
    { id: 2, name: "Westside", location: "Los Angeles", screens: 8 },
    { id: 3, name: "Northside", location: "Chicago", screens: 6 }
  ];
  
  const [selectedTheater, setSelectedTheater] = useState(theaters[0]);

  // Fetch movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Access the API key using Vite's method
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.TMDB_API_KEY;
        
        if (!API_KEY) {
          throw new Error('TMDB API key not found in environment variables');
        }
        
        // Fetch featured movies (now playing)
        const nowPlayingResponse = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        
        if (!nowPlayingResponse.ok) {
          throw new Error('Failed to fetch now playing movies');
        }
        
        const nowPlayingData: TMDBResponse = await nowPlayingResponse.json();
        
        // Get genre list for mapping genre IDs to names
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        
        if (!genreResponse.ok) {
          throw new Error('Failed to fetch genre list');
        }
        
        const genreData = await genreResponse.json();
        const genreMap = new Map<number, string>(
          genreData.genres.map((genre: TMDBGenre) => [genre.id, genre.name])
        );
        
        // Process now playing movies with runtime info
        const processedMoviesPromises = nowPlayingData.results.slice(0, 12).map(async (movie) => {
          // Get movie details to get runtime
          const movieDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`
          );
          
          if (!movieDetailsResponse.ok) {
            throw new Error(`Failed to fetch details for movie ${movie.id}`);
          }
          
          const movieDetails = await movieDetailsResponse.json();
          
          return {
            id: movie.id,
            title: movie.title,
            posterPath: getPosterUrl(movie.poster_path),
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average,
            genres: movie.genre_ids.map(id => genreMap.get(id) || 'Unknown') as string[],
            runtime: movieDetails.runtime || 0
          };
        });
        
        const processedNowPlaying = await Promise.all(processedMoviesPromises);
        
        // Create featured slides from top 3 movies
        const slides = nowPlayingData.results.slice(0, 3).map((movie) => ({
          id: movie.id,
          backdropPath: getBackdropUrl(movie.backdrop_path),
          title: movie.title,
          overview: movie.overview,
          path: `/movies/${movie.id}`
        }));
        
        setFeaturedMovies(processedNowPlaying);
        setFeaturedSlides(slides);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError('Failed to fetch movie data. Using fallback data instead.');
        
        // Use placeholder data if API fails
        setFeaturedMovies(getFallbackMovies());
        setFeaturedSlides(getFallbackSlides());
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  // Fallback data in case API fails
  const getFallbackMovies = (): Movie[] => [
    { id: 1, title: 'Venom', posterPath: '/images/m1.jpg', releaseDate: '2023-10-15', voteAverage: 7.5, genres: ['Action', 'Sci-Fi'], runtime: 112 },
    { id: 2, title: 'Dunkirk', posterPath: '/images/m2.jpg', releaseDate: '2023-09-20', voteAverage: 8.2, genres: ['War', 'Action', 'Drama'], runtime: 106 },
    { id: 3, title: 'Batman Vs Superman', posterPath: '/images/m3.jpg', releaseDate: '2023-11-05', voteAverage: 6.8, genres: ['Action', 'Adventure'], runtime: 152 },
    { id: 4, title: 'John Wick 2', posterPath: '/images/m4.jpg', releaseDate: '2023-09-28', voteAverage: 7.9, genres: ['Action', 'Thriller'], runtime: 122 },
    { id: 5, title: 'Aquaman', posterPath: '/images/m5.jpg', releaseDate: '2023-12-10', voteAverage: 7.2, genres: ['Adventure', 'Fantasy'], runtime: 143 },
    { id: 6, title: 'Black Panther', posterPath: '/images/m6.jpg', releaseDate: '2023-10-25', voteAverage: 8.5, genres: ['Action', 'Adventure'], runtime: 134 },
    { id: 7, title: 'Thor', posterPath: '/images/m7.jpg', releaseDate: '2023-11-15', voteAverage: 7.4, genres: ['Action', 'Fantasy'], runtime: 115 },
    { id: 8, title: 'Bumblebee', posterPath: '/images/m8.png', releaseDate: '2023-10-01', voteAverage: 6.9, genres: ['Sci-Fi', 'Action'], runtime: 114 }
  ];

  const getFallbackSlides = (): Slide[] => [
    {
      id: 1,
      backdropPath: '/images/home1.jpg',
      title: 'Venom: Let There Be Carnage',
      overview: 'Tom Hardy returns to the big screen as the lethal protector Venom, one of Marvel\'s greatest and most complex characters.',
      path: '/movies/venom-2'
    },
    {
      id: 2,
      backdropPath: '/images/home2.jpg',
      title: 'Avengers: Infinity War',
      overview: 'The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.',
      path: '/movies/avengers-infinity-war'
    },
    {
      id: 3,
      backdropPath: '/images/home3.jpg',
      title: 'Spider-Man: Far from Home',
      overview: 'Following the events of Avengers: Endgame, Spider-Man must step up to take on new threats in a world that has changed forever.',
      path: '/movies/spider-man-far-from-home'
    }
  ];

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  // Slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredSlides.length - 1 : prev - 1));
  };

  // Play trailer
  const playTrailer = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();
    
    try {
      // Access the API key using Vite's method
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.TMDB_API_KEY;
      
      if (!API_KEY) {
        throw new Error('TMDB API key not found in environment variables');
      }
      
      const trailerResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      
      if (!trailerResponse.ok) {
        throw new Error(`Failed to fetch trailer for movie ${movieId}`);
      }
      
      const trailerData = await trailerResponse.json();
      
      const trailer = trailerData.results.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailer) {
        // Open YouTube trailer in a new tab
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
      } else {
        alert('No trailer available for this movie');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Failed to load trailer');
    }
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    if (!minutes) return '0h 0m'; // Handle case when runtime is 0
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state
  if (error && !featuredMovies.length) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <div className="hero-slider">
        {featuredSlides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.backdropPath})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <div className="content-box">
                <span className="universe">FEATURED MOVIE</span>
                <h1 className="movie-title">{slide.title}</h1>
                <p className="movie-overview">{slide.overview}</p>
                <div className="actions">
                  <button className="btn book-now" onClick={() => navigate(slide.path)}>
                    BOOK NOW
                  </button>
                  <button className="btn-play" onClick={(e) => playTrailer(e, slide.id)}>
                    <i className="play-icon">▶</i>
                    <span>TRAILER</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider controls */}
        <button className="slider-control prev" onClick={prevSlide}>❮</button>
        <button className="slider-control next" onClick={nextSlide}>❯</button>
        
        {/* Slider pagination */}
        <div className="slider-pagination">
          {featuredSlides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Theaters Section */}
      <section className="section theaters-section">
        <h2 className="section-title">Theaters</h2>
        <div className="theater-selector">
          <div className="theater-selector-inner">
            <div className="theater-options">
              {theaters.map(theater => (
                <div 
                  key={theater.id} 
                  className={`theater-option ${theater.id === selectedTheater.id ? 'active' : ''}`}
                  onClick={() => setSelectedTheater(theater)}
                >
                  <span className="theater-name">{theater.name}</span>
                  <span className="theater-location">{theater.location}</span>
                  <span className="theater-screens">{theater.screens} Screens</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Available This Week */}
      <section className="section movies">
        <h2 className="section-title">Available This Week</h2>
        <div className="movie-grid">
          {featuredMovies.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
              <div className="movie-image">
                <img src={movie.posterPath} alt={movie.title} />
                <div className="movie-rating">{movie.voteAverage.toFixed(1)}</div>
              </div>
              <h3 className="movie-name">{movie.title}</h3>
              <p className="movie-info">
                {movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'N/A'}
                {movie.genres && movie.genres.length > 1 ? ` / ${movie.genres[1]}` : ''} • {formatRuntime(movie.runtime || 0)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="movie-icon">🎬</i> Lion's Den
          </div>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Lion's Den Cinemas. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;