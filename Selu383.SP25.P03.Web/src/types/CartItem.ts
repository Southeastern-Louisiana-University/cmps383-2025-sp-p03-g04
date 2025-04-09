export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    type: string;
    showtimeId: number;
    showtime: {
      id: number;
      movieId: number;
      movieTitle: string;
      startTime: string;
      screenName: string;
      theaterName: string;
    };
    seatId: number;
    seatLabel: string;
    seat: {
      id: number;
      row: string;
      number: number;
    };
    ticketType: string;
  }
  