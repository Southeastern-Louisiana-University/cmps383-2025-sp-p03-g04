import { fetchWithCredentials } from '../api/config';
import { Movie, Showtime } from '../../types/models/movie';

/**
 * Get all movies
 */
export const getMovies = async (): Promise<Movie[]> => {
  return fetchWithCredentials('/api/movies');
};

/**
 * Get a movie by ID
 */
export const getMovie = async (id: number): Promise<Movie> => {
  return fetchWithCredentials(`/api/movies/${id}`);
};

/**
 * Get all showtimes
 */
export const getShowtimes = async (): Promise<Showtime[]> => {
  return fetchWithCredentials('/api/showtimes');
};

/**
 * Get showtimes for a specific movie
 */
export const getShowtimesByMovie = async (movieId: number): Promise<Showtime[]> => {
  return fetchWithCredentials(`/api/showtimes/movie/${movieId}`);
};

/**
 * Get showtimes for a specific theater
 */
export const getShowtimesByTheater = async (theaterId: number): Promise<Showtime[]> => {
  // Filter showtimes by theater ID
  const allShowtimes = await getShowtimes();
  return allShowtimes.filter(showtime => showtime.theaterId === theaterId);
};

/**
 * Get a specific showtime by ID
 */
export const getShowtime = async (id: number): Promise<Showtime> => {
  return fetchWithCredentials(`/api/showtimes/${id}`);
};