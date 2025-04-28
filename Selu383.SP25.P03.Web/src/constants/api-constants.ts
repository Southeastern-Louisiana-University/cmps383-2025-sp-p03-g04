export const API_ENDPOINTS = {
  LOGIN: "/api/authentication/login",
  LOGOUT: "/api/authentication/logout",
  CURRENT_USER: "/api/authentication/me",

  USERS: "/api/users",

  MOVIES: "/api/movies",
  MOVIE_BY_ID: (id: number) => `/api/movies/${id}`,

  SHOWTIMES: "/api/showtimes",
  SHOWTIME_BY_ID: (id: number) => `/api/showtimes/${id}`,
  SHOWTIMES_BY_MOVIE: (movieId: number) => `/api/showtimes/movie/${movieId}`,

  THEATERS: "/api/theaters",
  THEATER_BY_ID: (id: number) => `/api/theaters/${id}`,
  THEATER_SCREENS: (theaterId: number) => `/api/theaters/${theaterId}/screens`,

  SEATS_BY_SHOWTIME: (showtimeId: number) =>
    `/api/seats/showtime/${showtimeId}`,

  RESERVATIONS: "/api/reservations",
  RESERVATION_BY_ID: (id: number) => `/api/reservations/${id}`,
  USER_RESERVATIONS: (userId: number) => `/api/reservations/user/${userId}`,
  PAY_RESERVATION: (id: number) => `/api/reservations/${id}/pay`,

  FOOD_CATEGORIES: "/api/food-categories",
  FOOD_ITEMS: "/api/food-items",
  FOOD_ITEMS_BY_CATEGORY: (categoryId: number) =>
    `/api/food-items/category/${categoryId}`,
  FOOD_ORDERS: "/api/food-orders",
  USER_FOOD_ORDERS: "/api/food-orders/my-orders",
};
