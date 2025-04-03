export interface TheaterResponse {
    id: number;
    name: string;
    address: string;
    seatCount: number;
    managerId?: number;
  }
  
  export interface ScreenResponse {
    id: number;
    name: string;
    capacity: number;
    theaterId: number;
    theaterName: string;
  }
  
  export interface SeatResponse {
    id: number;
    row: string;
    number: number;
    screenId: number;
    status: 'Available' | 'Selected' | 'Taken';
  }
  
  export interface SeatingLayoutResponse {
    showtimeId: number;
    movieTitle: string;
    startTime: string;
    screenName: string;
    theaterId: number;
    theaterName: string;
    ticketPrice: number;
    rows: Record<string, SeatResponse[]>;
  }