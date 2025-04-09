import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';

export interface CreateReservationTicket {
  seatId: number;
  ticketType: string;
}

export interface CreateReservationRequest {
  showtimeId: number;
  tickets: CreateReservationTicket[];
}

export interface ReservationResponse {
  id: number;
  reservationTime: string;
  showtimeId: number;
  userId?: number;
  totalAmount: number;
  isPaid: boolean;
  tickets: {
    id: number;
    seatId: number;
    ticketType: string;
    price: number;
  }[];
}

export const createReservation = async (request: CreateReservationRequest): Promise<ReservationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create reservation: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const getReservation = async (reservationId: number): Promise<ReservationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reservation: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching reservation ${reservationId}:`, error);
    throw error;
  }
};

export const cancelReservation = async (reservationId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel reservation: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error canceling reservation ${reservationId}:`, error);
    throw error;
  }
};