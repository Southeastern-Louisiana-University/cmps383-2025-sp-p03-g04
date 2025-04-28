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
