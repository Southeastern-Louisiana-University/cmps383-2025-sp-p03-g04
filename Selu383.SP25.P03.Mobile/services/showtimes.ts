import * as api from './api';
import { Showtime } from '@/components/TodaysShowsList';

/**
 * Fetches all showtimes from the API
 * @returns A promise that resolves to an array of showtimes
 */
export async function getShowtimes(): Promise<Showtime[]> {
  return api.getShowtimes();
}

/**
 * Fetches showtimes for a specific movie
 * @param movieId The ID of the movie
 * @returns A promise that resolves to an array of showtimes
 */
export async function getShowtimesByMovie(movieId: number): Promise<Showtime[]> {
  return api.getShowtimesByMovie(movieId);
}

/**
 * Fetches showtimes for a specific theater
 * @param theaterId The ID of the theater
 * @returns A promise that resolves to an array of showtimes
 */
export async function getShowtimesByTheater(theaterId: number): Promise<Showtime[]> {
  // Filter showtimes by theater ID after fetching all showtimes
  const allShowtimes = await api.getShowtimes();
  return allShowtimes.filter(showtime => showtime.theaterId === theaterId);
}