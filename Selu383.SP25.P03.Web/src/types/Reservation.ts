export interface TicketDto {
    id: number;
    seatId: number;
    row: string;
    number: number;
    ticketType: string;
    price: number;
  }
  
  export interface ReservationDto {
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
    tickets: TicketDto[];
  }