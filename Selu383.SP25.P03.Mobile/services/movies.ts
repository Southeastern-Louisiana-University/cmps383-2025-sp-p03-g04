import * as api from './api';
import { Movie } from '@/components/MovieCarousel';

/**
 * Fetches all movies from the API
 * @returns A promise that resolves to an array of movies
 */
export async function getMovies(): Promise<Movie[]> {
  return api.getMovies();
}

/**
 * Fetches a specific movie by ID
 * @param id The ID of the movie to fetch
 * @returns A promise that resolves to the movie
 */
export async function getMovie(id: number): Promise<Movie> {
  return api.getMovie(id);
}