export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  runtime: number;
  description?: string;
  rating?: string;
  releaseDate?: Date;
  tmdbId?: number;
  genre?: string;
  trailerUrl?: string;
}

export interface Showtime {
  id: number;
  startTime: string;
  ticketPrice: number;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  theaterId: number;
  theaterName: string;
}

export interface ShowtimesByTheater {
  theaterId: number;
  theaterName: string;
  distance?: string;
  showtimes: {
    id: number;
    startTime: string;
  }[];
}
