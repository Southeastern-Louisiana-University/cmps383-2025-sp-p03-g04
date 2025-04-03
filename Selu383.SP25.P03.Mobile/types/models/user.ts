export type UserRole = 'customer' | 'staff' | 'manager';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}