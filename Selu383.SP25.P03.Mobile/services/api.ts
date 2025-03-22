import { Movie } from '@/components/MovieCarousel';
import { Showtime } from '@/components/TodaysShowsList';
import { Theater } from '@/components/TheaterSelector';

// Base URL API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://selu383-sp25-p03-g04.azurewebsites.net/api';

// authentication response
interface AuthResponse {
  id: number;
  userName: string;
  roles: string[];
}

// login request
interface LoginRequest {
  userName: string;
  password: string;
}

// Helper function to create proper headers
const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  // Add auth token if it exists and is requested
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic fetch function with error handling
const fetchApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: options.headers || createHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth APIs
export const login = (credentials: LoginRequest): Promise<AuthResponse> => {
  return fetchApi<AuthResponse>('/authentication/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const getCurrentUser = (): Promise<AuthResponse> => {
  return fetchApi<AuthResponse>('/authentication/me', {
    headers: createHeaders(true)
  });
};

export const logout = (): Promise<void> => {
  return fetchApi<void>('/authentication/logout', {
    method: 'POST',
    headers: createHeaders(true)
  });
};

// Movie APIs
export const getMovies = (): Promise<Movie[]> => {
  return fetchApi<Movie[]>('/movies');
};

export const getMovie = (id: number): Promise<Movie> => {
  return fetchApi<Movie>(`/movies/${id}`);
};

// Theater APIs
export const getTheaters = (): Promise<Theater[]> => {
  return fetchApi<Theater[]>('/theaters');
};

export const getTheater = (id: number): Promise<Theater> => {
  return fetchApi<Theater>(`/theaters/${id}`);
};

// Showtime APIs
export const getShowtimes = (): Promise<Showtime[]> => {
  return fetchApi<Showtime[]>('/showtimes');
};

export const getShowtimesByMovie = (movieId: number): Promise<Showtime[]> => {
  return fetchApi<Showtime[]>(`/showtimes/movie/${movieId}`);
};

// Seat APIs
export interface Seat {
  id: number;
  row: string;
  number: number;
  screenId: number;
  isAvailable: boolean;
}

export const getSeatsForShowtime = (showtimeId: number): Promise<Seat[]> => {
  return fetchApi<Seat[]>(`/seats/showtime/${showtimeId}`);
};

// Reservation APIs
export interface ReservationRequest {
  showtimeId: number;
  seatIds: number[];
}

export interface Reservation {
  id: number;
  showtimeId: number;
  seats: Seat[];
  totalAmount: number;
  isPaid: boolean;
}

export const createReservation = (reservation: ReservationRequest): Promise<Reservation> => {
  return fetchApi<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
    headers: createHeaders(true)
  });
};

export const getUserReservations = (userId: number): Promise<Reservation[]> => {
  return fetchApi<Reservation[]>(`/reservations/user/${userId}`, {
    headers: createHeaders(true)
  });
};

export const fetchTmdbMovieDetails = (tmdbId: number): Promise<any> => {
  return fetchApi<any>(`/tmdb/details/${tmdbId}`);
};

export const fetchTmdbMovieVideos = (tmdbId: number): Promise<any> => {
  return fetchApi<any>(`/tmdb/videos/${tmdbId}`);
};