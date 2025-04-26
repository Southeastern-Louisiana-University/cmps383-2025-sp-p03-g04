export type UserRole = "customer" | "staff" | "manager";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
}
