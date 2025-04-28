import { API_BASE_URL, DEFAULT_HEADERS } from "../config/api";
import { TicketType } from "../types/booking";

export const getTicketPrices = async (
  showtimeId: number
): Promise<TicketType[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/tickets/prices?showtimeId=${showtimeId}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ticket prices: ${response.status}`);
    }

    const ticketPrices: TicketType[] = await response.json();

    return ticketPrices.map((ticket) => ({
      ...ticket,
      count: 0,
    }));
  } catch (error) {
    console.error(
      `Error fetching ticket prices for showtime ID ${showtimeId}:`,
      error
    );
    throw error;
  }
};
