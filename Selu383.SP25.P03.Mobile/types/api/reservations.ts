export interface CreateTicketRequest {
  seatId: number;
  ticketType: string;
  price?: number;
}

export interface CreateReservationRequest {
  showtimeId: number;
  tickets: CreateTicketRequest[];
  processPayment?: boolean;
}

export interface TicketResponse {
  id: number;
  seatId: number;
  row: string;
  number: number;
  ticketType: string;
  price: number;
}

export interface ReservationResponse {
  id: number;
  reservationTime: string;
  isPaid: boolean;
  totalAmount: number;
  userId?: number;
  showtimeId: number;
  showtimeStartTime: string;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  tickets: TicketResponse[];
}
