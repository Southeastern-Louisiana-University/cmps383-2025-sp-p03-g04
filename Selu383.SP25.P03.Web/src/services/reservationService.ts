import { ReservationDto } from '../types/Reservation';

const BASE_URL = '/api/reservations';

export const getReservation = async (id: number): Promise<ReservationDto> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch reservation');
  }
  
  return response.json();
};

export const createReservation = async (data: any): Promise<ReservationDto> => {
  console.log('Sending reservation request:', data);
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Reservation creation failed:', errorText);
    
    // Try to parse error message from backend
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Failed to create reservation');
    } catch {
      throw new Error(`Failed to create reservation: ${response.status} ${response.statusText}`);
    }
  }
  
  const responseData = await response.json();
  console.log('Reservation response:', responseData);
  
  return responseData;
};

export const getUserReservations = async (userId: number): Promise<ReservationDto[]> => {
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user reservations');
  }
  
  return response.json();
};

export const markAsPaid = async (id: number): Promise<ReservationDto> => {
  const response = await fetch(`${BASE_URL}/${id}/pay`, {
    method: 'PUT',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark reservation as paid');
  }
  
  return response.json();
};

export const cancelReservation = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to cancel reservation');
  }
};