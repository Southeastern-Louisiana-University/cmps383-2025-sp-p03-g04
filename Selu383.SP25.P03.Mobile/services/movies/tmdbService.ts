import { fetchWithCredentials } from "../api/config";
import { TmdbMovieDetails, TmdbVideosResult } from "../../types/api/movies";

/**
 * Fetches detailed information about a movie from TMDB, including trailer URLs
 */
export async function getMovieDetails(
  tmdbId: number
): Promise<TmdbMovieDetails> {
  try {
    // First get the basic movie details
    const movieDetails = await fetchWithCredentials<any>(`/api/tmdb/${tmdbId}`);

    // Then fetch videos to find a trailer
    const videos = await fetchWithCredentials<TmdbVideosResult>(
      `/api/tmdb/videos/${tmdbId}`
    );

    // Look for an official trailer
    let trailerUrl;
    if (videos && videos.results) {
      // Try to find an official trailer first
      const trailer = videos.results.find(
        (video) =>
          video.type === "Trailer" && video.site === "YouTube" && video.official
      );

      // If no official trailer, try any trailer
      if (!trailer) {
        const anyTrailer = videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
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
      trailerUrl,
    };
  } catch (error) {
    console.error("Failed to fetch TMDB movie details:", error);
    throw error;
  }
}

/**
 * Search for movies in TMDB database
 */
export async function searchMovies(query: string): Promise<any> {
  return fetchWithCredentials<any>(
    `/api/tmdb/search?query=${encodeURIComponent(query)}`
  );
}

/**
 * Get now playing movies from TMDB
 */
export async function getNowPlayingMovies(): Promise<any> {
  return fetchWithCredentials<any>("/api/tmdb/now-playing");
}

/**
 * Map genres from TMDB to a single string format
 */
export function formatGenres(genres: { id: number; name: string }[]): string {
  if (!genres || genres.length === 0) return "N/A";

  return genres
    .slice(0, 2)
    .map((g) => g.name)
    .join("/");
}
