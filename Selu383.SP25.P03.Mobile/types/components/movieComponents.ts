import { Movie, Showtime } from "../models/movie";

export interface MovieCarouselProps {
  movies: Movie[];
  onSelectMovie?: (movieId: number) => void;
}

export interface ShowtimeListProps {
  showtimes: Showtime[];
  onSelectShowtime?: (showtimeId: number) => void;
}

export interface MovieDetailsProps {
  movieId: number;
}
