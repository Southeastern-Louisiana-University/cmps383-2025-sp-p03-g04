import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../constants/api-constants";
import {
  TheaterResponse,
  ScreenResponse,
  SeatingLayoutResponse,
} from "../../types/api/theaters";
import { Theater, Screen, SeatingLayout } from "../../types/models/theater";

export const getTheaters = async (): Promise<Theater[]> => {
  return fetchWithCredentials<TheaterResponse[]>(API_ENDPOINTS.THEATERS);
};

export const getTheater = async (id: number): Promise<Theater> => {
  return fetchWithCredentials<TheaterResponse>(API_ENDPOINTS.THEATER_BY_ID(id));
};

export const getScreensByTheater = async (
  theaterId: number
): Promise<Screen[]> => {
  return fetchWithCredentials<ScreenResponse[]>(
    API_ENDPOINTS.THEATER_SCREENS(theaterId)
  );
};

export const getSeatsForShowtime = async (
  showtimeId: number,
  userId?: number
): Promise<SeatingLayout> => {
  const url = userId
    ? `${API_ENDPOINTS.SEATS_BY_SHOWTIME(showtimeId)}?userId=${userId}`
    : API_ENDPOINTS.SEATS_BY_SHOWTIME(showtimeId);

  return fetchWithCredentials<SeatingLayoutResponse>(url);
};
