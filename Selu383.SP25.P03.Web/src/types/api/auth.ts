export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UserResponse {
  id: number;
  userName: string;
  roles: string[];
}

export interface AuthContextType {
  user: {
    id: number;
    username: string;
    role: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
}
