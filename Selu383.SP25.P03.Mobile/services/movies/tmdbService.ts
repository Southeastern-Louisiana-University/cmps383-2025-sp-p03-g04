import { fetchWithCredentials } from "../api/config";
import { TmdbMovieDetails, TmdbVideosResult } from "../../types/api/movies";

export async function getMovieDetails(
  tmdbId: number
): Promise<TmdbMovieDetails> {
  try {
    const movieDetails = await fetchWithCredentials<any>(`/api/tmdb/${tmdbId}`);

    const videos = await fetchWithCredentials<TmdbVideosResult>(
      `/api/tmdb/videos/${tmdbId}`
    );

    let trailerUrl;
    if (videos && videos.results) {
      const trailer = videos.results.find(
        (video) =>
          video.type === "Trailer" && video.site === "YouTube" && video.official
      );

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

export async function searchMovies(query: string): Promise<any> {
  return fetchWithCredentials<any>(
    `/api/tmdb/search?query=${encodeURIComponent(query)}`
  );
}

export async function getNowPlayingMovies(): Promise<any> {
  return fetchWithCredentials<any>("/api/tmdb/now-playing");
}

export function formatGenres(genres: { id: number; name: string }[]): string {
  if (!genres || genres.length === 0) return "N/A";

  return genres
    .slice(0, 2)
    .map((g) => g.name)
    .join("/");
}
