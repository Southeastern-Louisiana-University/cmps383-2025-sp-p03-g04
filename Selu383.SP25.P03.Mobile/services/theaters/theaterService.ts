import { fetchWithCredentials } from "../api/config";
import {
  TheaterResponse,
  ScreenResponse,
  SeatingLayoutResponse,
} from "../../types/api/theaters";
import { Theater, Screen, SeatingLayout } from "../../types/models/theater";

/**
 * Get all theaters
 */
export const getTheaters = async (): Promise<Theater[]> => {
  return fetchWithCredentials<TheaterResponse[]>("/api/theaters");
};

/**
 * Get a theater by ID
 */
export const getTheater = async (id: number): Promise<Theater> => {
  return fetchWithCredentials<TheaterResponse>(`/api/theaters/${id}`);
};

/**
 * Get all screens for a theater
 */
export const getScreensByTheater = async (
  theaterId: number
): Promise<Screen[]> => {
  return fetchWithCredentials<ScreenResponse[]>(
    `/api/theaters/${theaterId}/screens`
  );
};

/**
 * Get seating layout for a showtime
 */
export const getSeatsForShowtime = async (
  showtimeId: number,
  userId?: number
): Promise<SeatingLayout> => {
  const url = userId
    ? `/api/seats/showtime/${showtimeId}?userId=${userId}`
    : `/api/seats/showtime/${showtimeId}`;

  return fetchWithCredentials<SeatingLayoutResponse>(url);
};
