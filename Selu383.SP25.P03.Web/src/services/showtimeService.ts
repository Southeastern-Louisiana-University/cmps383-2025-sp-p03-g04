import { Showtime } from "../types/Showtime";
import { API_BASE_URL, DEFAULT_HEADERS } from "../config/api";

export const getShowtimes = async (): Promise<Showtime[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch showtimes: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    throw error;
  }
};

export const getShowtimesByMovie = async (
  movieId: number
): Promise<Showtime[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes/movie/${movieId}`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch showtimes for movie ${movieId}: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching showtimes for movie ID ${movieId}:`, error);
    throw error;
  }
};

export const getShowtime = async (id: number): Promise<Showtime> => {
  try {
    const response = await fetch(`${API_BASE_URL}/showtimes/${id}`, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch showtime ${id}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching showtime ID ${id}:`, error);
    throw error;
  }
};

export const getShowtimesByTheater = async (
  theaterId: number
): Promise<Showtime[]> => {
  try {
    const allShowtimes = await getShowtimes();
    return allShowtimes.filter((showtime) => showtime.theaterId === theaterId);
  } catch (error) {
    console.error(
      `Error fetching showtimes for theater ID ${theaterId}:`,
      error
    );
    throw error;
  }
};
