export interface MovieResponse {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  runtime: number;
  rating: string;
  releaseDate: string;
  tmdbId?: number;
}

export interface ShowtimeResponse {
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

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  runtime: number;
  releaseDate: string;
  voteAverage: number;
  genres: { id: number; name: string }[];
  trailerUrl?: string;
}

export interface TmdbVideoResponse {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

export interface TmdbVideosResult {
  results: TmdbVideoResponse[];
}
