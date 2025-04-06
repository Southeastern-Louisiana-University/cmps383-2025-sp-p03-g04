import { Showtime } from '../types/Showtime';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';

/**
 * Fetches all showtimes from the API
 */
export const getShowtimes = async (): Promise<Showtime[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch showtimes: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    throw error;
  }
};

/**
 * Fetches a single showtime by ID
 */
export const getShowtime = async (id: number): Promise<Showtime> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes/${id}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch showtime: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching showtime with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches showtimes for a specific movie
 */
export const getShowtimesByMovie = async (movieId: number): Promise<Showtime[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes/movie/${movieId}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch showtimes for movie ${movieId}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching showtimes for movie ID ${movieId}:`, error);
    throw error;
  }
};

/**
 * Fetches showtimes for a specific theater
 */
export const getShowtimesByTheater = async (theaterId: number): Promise<Showtime[]> => {
  try {
    const allShowtimes = await getShowtimes();
    return allShowtimes.filter(showtime => showtime.theaterId === theaterId);
  } catch (error) {
    console.error(`Error fetching showtimes for theater ID ${theaterId}:`, error);
    throw error;
  }
};