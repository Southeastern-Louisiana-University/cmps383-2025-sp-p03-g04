import * as api from './api';

// Interface for login request
export interface LoginRequest {
  userName: string;
  password: string;
}

// Interface for user information
export interface User {
  id: number;
  userName: string;
  roles: string[];
}

/**
 * Attempts to log in a user with the provided credentials
 * @param userName The username
 * @param password The password
 * @returns A promise that resolves to the user information
 */
export async function login(userName: string, password: string): Promise<User> {
  return api.login({ userName, password });
}

/**
 * Gets the current user's information
 * @returns A promise that resolves to the user information
 */
export async function getCurrentUser(): Promise<User> {
  return api.getCurrentUser();
}

/**
 * Logs out the current user
 * @returns A promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  return api.logout();
}