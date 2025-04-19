// Seat related types
export interface Seat {
  id: number;
  row: string;
  number: number;
  screenId: number;
  status: SeatStatus;
}

export enum SeatStatus {
  Available = "Available",
  Selected = "Selected",
  Taken = "Taken"
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

// Ticket related types
export interface TicketType {
  type: "Adult" | "Child" | "Senior";
  price: number;
  count: number;
  multiplier: number;
}

// Cart related types
export interface CartItem {
  seatId: number;
  seatLabel: string;
  ticketType: string;
  price: number;
  showtimeId: number;
  movieTitle?: string;
}