import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../constants/api-constants";
import { Movie, Showtime } from "../../types/models/movie";

export const getMovies = async (): Promise<Movie[]> => {
  return fetchWithCredentials(API_ENDPOINTS.MOVIES);
};

export const getMovie = async (id: number): Promise<Movie> => {
  return fetchWithCredentials(API_ENDPOINTS.MOVIE_BY_ID(id));
};

export const getShowtimes = async (): Promise<Showtime[]> => {
  return fetchWithCredentials(API_ENDPOINTS.SHOWTIMES);
};

export const getShowtimesByDate = async (): Promise<
  Record<string, Showtime[]>
> => {
  const showtimes = await getShowtimes();
  const groupedByDate: Record<string, Showtime[]> = {};

  showtimes.forEach((showtime) => {
    const date = new Date(showtime.startTime).toISOString().split("T")[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(showtime);
  });

  return groupedByDate;
};

export const getTodaysShowtimes = async (): Promise<Showtime[]> => {
  const today = new Date().toISOString().split("T")[0];
  const groupedShowtimes = await getShowtimesByDate();
  return groupedShowtimes[today] || [];
};

export const getTomorrowsShowtimes = async (): Promise<Showtime[]> => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const groupedShowtimes = await getShowtimesByDate();
  return groupedShowtimes[tomorrowStr] || [];
};

export const getShowtimesByMovie = async (
  movieId: number
): Promise<Showtime[]> => {
  return fetchWithCredentials(API_ENDPOINTS.SHOWTIMES_BY_MOVIE(movieId));
};

export const getShowtimesByTheater = async (
  theaterId: number
): Promise<Showtime[]> => {
  const allShowtimes = await getShowtimes();
  return allShowtimes.filter((showtime) => showtime.theaterId === theaterId);
};

export const getShowtime = async (id: number): Promise<Showtime> => {
  return fetchWithCredentials(API_ENDPOINTS.SHOWTIME_BY_ID(id));
};
