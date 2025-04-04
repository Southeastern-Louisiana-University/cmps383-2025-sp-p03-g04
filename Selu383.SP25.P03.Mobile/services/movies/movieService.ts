import { fetchWithCredentials } from "../api/config";
import { Movie, Showtime } from "../../types/models/movie";

/**
 * Get all movies
 */
export const getMovies = async (): Promise<Movie[]> => {
  return fetchWithCredentials("/api/movies");
};

/**
 * Get a movie by ID
 */
export const getMovie = async (id: number): Promise<Movie> => {
  return fetchWithCredentials(`/api/movies/${id}`);
};

/**
 * Get all showtimes within the 48-hour window
 * Backend now filters for this automatically
 */
export const getShowtimes = async (): Promise<Showtime[]> => {
  return fetchWithCredentials("/api/showtimes");
};

/**
 * Group showtimes by date for better UI organization
 */
export const getShowtimesByDate = async (): Promise<
  Record<string, Showtime[]>
> => {
  const showtimes = await getShowtimes();
  const groupedByDate: Record<string, Showtime[]> = {};

  showtimes.forEach((showtime) => {
    const date = new Date(showtime.startTime).toISOString().split("T")[0]; // YYYY-MM-DD

    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }

    groupedByDate[date].push(showtime);
  });

  return groupedByDate;
};

/**
 * Get showtimes for today
 */
export const getTodaysShowtimes = async (): Promise<Showtime[]> => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const groupedShowtimes = await getShowtimesByDate();

  return groupedShowtimes[today] || [];
};

/**
 * Get showtimes for tomorrow
 */
export const getTomorrowsShowtimes = async (): Promise<Showtime[]> => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

  const groupedShowtimes = await getShowtimesByDate();

  return groupedShowtimes[tomorrowStr] || [];
};

/**
 * Get showtimes for a specific movie
 * Backend already filters for time window
 */
export const getShowtimesByMovie = async (
  movieId: number
): Promise<Showtime[]> => {
  return fetchWithCredentials(`/api/showtimes/movie/${movieId}`);
};

/**
 * Get showtimes for a specific theater
 * Backend already filters for time window
 */
export const getShowtimesByTheater = async (
  theaterId: number
): Promise<Showtime[]> => {
  // Filter showtimes by theater ID
  const allShowtimes = await getShowtimes();
  return allShowtimes.filter((showtime) => showtime.theaterId === theaterId);
};

/**
 * Get a specific showtime by ID
 */
export const getShowtime = async (id: number): Promise<Showtime> => {
  return fetchWithCredentials(`/api/showtimes/${id}`);
};
