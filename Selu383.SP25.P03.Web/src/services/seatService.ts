import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';
import { SeatingLayout } from '../types/booking';

/**
 * Fetches seating layout for a specific showtime
 */
export const getSeatsForShowtime = async (showtimeId: number, userId?: number): Promise<SeatingLayout> => {
  try {
    const url = userId
      ? `${API_BASE_URL}/seats/showtime/${showtimeId}?userId=${userId}`
      : `${API_BASE_URL}/seats/showtime/${showtimeId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch seats for showtime: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching seats for showtime ID ${showtimeId}:`, error);
    throw error;
  }
};