import { fetchWithCredentials } from "../api/config";
import {
  CreateReservationRequest,
  ReservationResponse,
} from "../../types/api/reservations";

/**
 * Create a new reservation
 */
export const createReservation = async (
  request: CreateReservationRequest
): Promise<ReservationResponse> => {
  return fetchWithCredentials<ReservationResponse>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(request),
  });
};

/**
 * Get a reservation by ID
 */
export const getReservation = async (
  id: number
): Promise<ReservationResponse> => {
  return fetchWithCredentials<ReservationResponse>(`/api/reservations/${id}`);
};

/**
 * Get all reservations for a user
 */
export const getUserReservations = async (
  userId: number
): Promise<ReservationResponse[]> => {
  return fetchWithCredentials<ReservationResponse[]>(
    `/api/reservations/user/${userId}`
  );
};

/**
 * Mark a reservation as paid
 */
export const payForReservation = async (
  id: number
): Promise<ReservationResponse> => {
  return fetchWithCredentials<ReservationResponse>(
    `/api/reservations/${id}/pay`,
    {
      method: "PUT",
    }
  );
};

/**
 * Cancel a reservation
 */
export const cancelReservation = async (id: number): Promise<void> => {
  return fetchWithCredentials<void>(`/api/reservations/${id}`, {
    method: "DELETE",
  });
};
