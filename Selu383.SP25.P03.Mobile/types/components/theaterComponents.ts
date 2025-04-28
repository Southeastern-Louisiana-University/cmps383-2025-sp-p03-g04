import { Theater } from "../models/theater";

export interface TheaterSelectorProps {
  theaters: Theater[];
  selectedTheater: Theater | null;
  onSelectTheater: (theater: Theater) => void;
}

export interface SeatingMapProps {
  showtimeId: number;
  selectedSeats: number[];
  onSeatPress: (seatId: number) => void;
}
