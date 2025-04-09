import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';
import { TicketType } from '../types/booking';

/**
 * Fetches ticket types and prices for a specific showtime
 */
export const getTicketPrices = async (showtimeId: number): Promise<TicketType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/prices?showtimeId=${showtimeId}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ticket prices: ${response.status}`);
    }
    
    // The response should be an array of ticket types with their prices
    const ticketPrices: TicketType[] = await response.json();
    
    // Add count: 0 to each ticket type
    return ticketPrices.map(ticket => ({
      ...ticket,
      count: 0
    }));
  } catch (error) {
    console.error(`Error fetching ticket prices for showtime ID ${showtimeId}:`, error);
    throw error;
  }
};