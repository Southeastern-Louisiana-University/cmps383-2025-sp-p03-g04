import { Movie } from '../types/Movie';
import { API_BASE_URL, DEFAULT_HEADERS } from '../config/api';

/**
 * Fetches all movies from the API
 */
export const getMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

/**
 * Fetches a movie by ID
 */
export const getMovie = async (id: number): Promise<Movie> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a movie by ID
 */
export const updateMovie = async (id: number, movieData: Partial<Movie>): Promise<Movie> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movieData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update movie: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating movie with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches movie videos by ID (trailers)
 */
export const getMovieVideos = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tmdb/videos/${id}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch movie videos: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching videos for movie with ID ${id}:`, error);
    throw error;
  }
};