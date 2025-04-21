import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../constants/api-constants";
import {
  CreateReservationRequest,
  ReservationResponse,
} from "../../types/api/reservations";

export const createReservation = async (
  request: CreateReservationRequest
): Promise<ReservationResponse> => {
  const sanitizedRequest = {
    ...request,
    tickets: request.tickets.map((ticket) => ({
      seatId: ticket.seatId,
      ticketType: ticket.ticketType,
    })),
  };

  return fetchWithCredentials<ReservationResponse>(API_ENDPOINTS.RESERVATIONS, {
    method: "POST",
    body: JSON.stringify(sanitizedRequest),
  });
};

export const getReservation = async (
  id: number
): Promise<ReservationResponse> => {
  return fetchWithCredentials<ReservationResponse>(
    API_ENDPOINTS.RESERVATION_BY_ID(id)
  );
};

export const getUserReservations = async (
  userId: number
): Promise<ReservationResponse[]> => {
  return fetchWithCredentials<ReservationResponse[]>(
    API_ENDPOINTS.USER_RESERVATIONS(userId)
  );
};

export const payForReservation = async (
  id: number
): Promise<ReservationResponse> => {
  return fetchWithCredentials<ReservationResponse>(
    API_ENDPOINTS.PAY_RESERVATION(id),
    {
      method: "PUT",
    }
  );
};

export const cancelReservation = async (id: number): Promise<void> => {
  return fetchWithCredentials<void>(API_ENDPOINTS.RESERVATION_BY_ID(id), {
    method: "DELETE",
  });
};