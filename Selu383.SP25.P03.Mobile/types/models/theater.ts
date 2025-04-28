export interface Theater {
  id: number;
  name: string;
  address: string;
  seatCount?: number;
  managerId?: number;
  distance?: string;
}

export interface Screen {
  id: number;
  name: string;
  capacity: number;
  theaterId: number;
  theaterName: string;
}

export interface Seat {
  id: number;
  row: string;
  number: number;
  screenId: number;
  status: "Available" | "Selected" | "Taken";
}

export interface SeatingLayout {
  showtimeId: number;
  movieTitle: string;
  startTime: string;
  screenName: string;
  theaterId: number;
  theaterName: string;
  ticketPrice: number;
  rows: Record<string, Seat[]>;
}
