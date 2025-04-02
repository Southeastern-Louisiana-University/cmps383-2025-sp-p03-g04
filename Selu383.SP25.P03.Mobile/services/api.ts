import { BASE_URL } from "@/constants/BaseUrl";

// Helper function to handle fetch requests
async function fetchWithCredentials<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Always include credentials for cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  runtime: number;
  rating: string;
  releaseDate: string;
  tmdbId?: number;
}

export const getMovies = (): Promise<Movie[]> => {
  return fetchWithCredentials<Movie[]>("/api/movies");
};

export const getMovie = (id: number): Promise<Movie> => {
  return fetchWithCredentials<Movie>(`/api/movies/${id}`);
};

export interface Theater {
  id: number;
  name: string;
  address: string;
  seatCount: number;
  managerId?: number;
}

export const getTheaters = (): Promise<Theater[]> => {
  return fetchWithCredentials<Theater[]>("/api/theaters");
};

export const getTheater = (id: number): Promise<Theater> => {
  return fetchWithCredentials<Theater>(`/api/theaters/${id}`);
};

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

export const getShowtimes = (): Promise<Showtime[]> => {
  return fetchWithCredentials<Showtime[]>("/api/showtimes");
};

export const getShowtimesByMovie = (movieId: number): Promise<Showtime[]> => {
  return fetchWithCredentials<Showtime[]>(`/api/showtimes/movie/${movieId}`);
};

export const getShowtimesByTheater = (
  theaterId: number
): Promise<Showtime[]> => {
  // Filter showtimes by theater ID
  return getShowtimes().then((showtimes) =>
    showtimes.filter((showtime) => showtime.theaterId === theaterId)
  );
};

export const getShowtime = (id: number): Promise<Showtime> => {
  return fetchWithCredentials<Showtime>(`/api/showtimes/${id}`);
};

export interface SeatDto {
  id: number;
  row: string;
  number: number;
  screenId: number;
  status: "Available" | "Selected" | "Taken";
}

export interface SeatingLayout {
  showtimeId: number;
  movieTitle: string;
  startTime: string;
  screenName: string;
  theaterId: number;
  theaterName: string;
  ticketPrice: number;
  rows: Record<string, SeatDto[]>;
}

export const getSeatsForShowtime = (
  showtimeId: number,
  userId?: number
): Promise<SeatingLayout> => {
  const url = userId
    ? `/api/seats/showtime/${showtimeId}?userId=${userId}`
    : `/api/seats/showtime/${showtimeId}`;

  return fetchWithCredentials<SeatingLayout>(url);
};

export interface CreateTicketDto {
  seatId: number;
  ticketType: string;
  price?: number;
}

export interface CreateReservationRequest {
  showtimeId: number;
  tickets: CreateTicketDto[];
  processPayment?: boolean;
}

export interface TicketDto {
  id: number;
  seatId: number;
  row: string;
  number: number;
  ticketType: string;
  price: number;
}

export interface ReservationDto {
  id: number;
  reservationTime: string;
  isPaid: boolean;
  totalAmount: number;
  userId?: number;
  showtimeId: number;
  showtimeStartTime: string;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  tickets: TicketDto[];
}

export const createReservation = (
  request: CreateReservationRequest
): Promise<ReservationDto> => {
  return fetchWithCredentials<ReservationDto>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(request),
  });
};

export const getReservation = (id: number): Promise<ReservationDto> => {
  return fetchWithCredentials<ReservationDto>(`/api/reservations/${id}`);
};

export const getUserReservations = (
  userId: number
): Promise<ReservationDto[]> => {
  return fetchWithCredentials<ReservationDto[]>(
    `/api/reservations/user/${userId}`
  );
};

export const payForReservation = (id: number): Promise<ReservationDto> => {
  return fetchWithCredentials<ReservationDto>(`/api/reservations/${id}/pay`, {
    method: "PUT",
  });
};

export const cancelReservation = (id: number): Promise<void> => {
  return fetchWithCredentials<void>(`/api/reservations/${id}`, {
    method: "DELETE",
  });
};

// Concessions types and functions
export interface FoodCategory {
  id: number;
  name: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

export interface FoodOrderItem {
  foodItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface FoodOrder {
  deliveryType: "Pickup" | "ToSeat";
  reservationId?: number;
  orderItems: FoodOrderItem[];
}

export interface FoodOrderItemDto {
  id: number;
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  foodItemImageUrl?: string;
}

export interface FoodOrderDto {
  id: number;
  orderTime: string;
  status: string;
  deliveryType: string;
  totalAmount: number;
  userId?: number;
  reservationId?: number;
  orderItems: FoodOrderItemDto[];
}

export const getFoodCategories = (): Promise<FoodCategory[]> => {
  return fetchWithCredentials<FoodCategory[]>("/api/food-categories");
};

export const getFoodItemsByCategory = (
  categoryId: number
): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItem[]>(
    `/api/food-items/category/${categoryId}`
  );
};

export const getAllFoodItems = (): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItem[]>("/api/food-items");
};

export const createFoodOrder = (order: FoodOrder): Promise<FoodOrderDto> => {
  return fetchWithCredentials<FoodOrderDto>("/api/food-orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

export const getUserFoodOrders = (): Promise<FoodOrderDto[]> => {
  return fetchWithCredentials<FoodOrderDto[]>("/api/food-orders/my-orders");
};

export const getFoodOrder = (id: number): Promise<FoodOrderDto> => {
  return fetchWithCredentials<FoodOrderDto>(`/api/food-orders/${id}`);
};

export const cancelFoodOrder = (id: number): Promise<void> => {
  return fetchWithCredentials<void>(`/api/food-orders/${id}`, {
    method: "DELETE",
  });
};
export function fetchTmdbMovieDetails(tmdbId: number) {
  throw new Error("Function not implemented.");
}

export function fetchTmdbMovieVideos(tmdbId: number) {
  throw new Error('Function not implemented.');
}

