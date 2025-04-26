export interface SeatInfo {
    id: number;
    row: string;
    number: number;
    screenId: number;
    status: 'Available' | 'Taken' | 'Selected';
  }
  

  export interface SeatingData {
    showtimeId: number;
    movieTitle: string;
    startTime: string;
    screenName: string;
    theaterId: number;
    theaterName: string;
    ticketPrice: number;
    rows: { [key: string]: SeatInfo[] };
  }
  