export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/api/authentication/login",
  LOGOUT: "/api/authentication/logout",
  CURRENT_USER: "/api/authentication/me",

  // Users
  USERS: "/api/users",

  // Movies
  MOVIES: "/api/movies",
  MOVIE_BY_ID: (id: number) => `/api/movies/${id}`,

  // Showtimes
  SHOWTIMES: "/api/showtimes",
  SHOWTIME_BY_ID: (id: number) => `/api/showtimes/${id}`,
  SHOWTIMES_BY_MOVIE: (movieId: number) => `/api/showtimes/movie/${movieId}`,

  // Theaters
  THEATERS: "/api/theaters",
  THEATER_BY_ID: (id: number) => `/api/theaters/${id}`,
  THEATER_SCREENS: (theaterId: number) => `/api/theaters/${theaterId}/screens`,

  // Seats
  SEATS_BY_SHOWTIME: (showtimeId: number) =>
    `/api/seats/showtime/${showtimeId}`,

  // Reservations
  RESERVATIONS: "/api/reservations",
  RESERVATION_BY_ID: (id: number) => `/api/reservations/${id}`,
  USER_RESERVATIONS: (userId: number) => `/api/reservations/user/${userId}`,
  PAY_RESERVATION: (id: number) => `/api/reservations/${id}/pay`,

  // Concessions
  FOOD_CATEGORIES: "/api/food-categories",
  FOOD_ITEMS: "/api/food-items",
  FOOD_ITEMS_BY_CATEGORY: (categoryId: number) =>
    `/api/food-items/category/${categoryId}`,
  FOOD_ORDERS: "/api/food-orders",
  USER_FOOD_ORDERS: "/api/food-orders/my-orders",
};
