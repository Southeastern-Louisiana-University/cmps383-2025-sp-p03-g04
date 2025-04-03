import { fetchWithCredentials } from "../api/config";
import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../../types/api/auth";

/**
 * Attempt to log in with the provided credentials
 */
export const login = async (
  userName: string,
  password: string
): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>("/api/authentication/login", {
    method: "POST",
    body: JSON.stringify({
      userName,
      password,
    }),
  });
};

/**
 * Register a new user
 */
export const register = async (
  data: RegisterRequest
): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>("/api/users", {
    method: "POST",
    body: JSON.stringify({
      Username: data.username,
      Password: data.password,
      Roles: data.roles,
    }),
  });
};

/**
 * Get the currently logged in user's information
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>("/api/authentication/me", {
    method: "GET",
  });
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  return fetchWithCredentials<void>("/api/authentication/logout", {
    method: "POST",
  });
};
