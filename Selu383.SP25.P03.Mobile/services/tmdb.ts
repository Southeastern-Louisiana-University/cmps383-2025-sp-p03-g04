// services/tmdb.ts - Modified version with explicit types for videos
import * as api from './api';

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

// Define the video interface
interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

/**
 * Fetches detailed information about a movie from TMDB, including trailer URLs
 */
export async function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
  try {
    // First get the basic movie details
    const movieDetails = await api.fetchTmdbMovieDetails(tmdbId);
    
    // Then fetch videos to find a trailer
    const videos = await api.fetchTmdbMovieVideos(tmdbId);
    
    // Look for an official trailer
    let trailerUrl;
    if (videos && videos.results) {
      // Try to find an official trailer first
      const trailer = videos.results.find(
        (video: TmdbVideo) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
      );
      
      // If no official trailer, try any trailer
      if (!trailer) {
        const anyTrailer = videos.results.find(
          (video: TmdbVideo) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (anyTrailer) {
          trailerUrl = `https://www.youtube.com/watch?v=${anyTrailer.key}`;
        }
      } else {
        trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      }
    }
    
    return {
      ...movieDetails,
      trailerUrl
    };
  } catch (error) {
    console.error('Failed to fetch TMDB movie details:', error);
    throw error;
  }
}

/**
 * Map genres from TMDB to a single string format
 */
export function formatGenres(genres: { id: number; name: string }[]): string {
  if (!genres || genres.length === 0) return 'N/A';
  
  return genres.slice(0, 2).map(g => g.name).join('/');
}