import { BASE_URL } from '@/constants/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  userName: string;
  roles: string[];
}

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

/**
 * Attempt to log in with the provided credentials
 */
export const login = async (userName: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/api/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        userName,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        Username: data.username,
        Password: data.password,
        Roles: data.roles,
        // Note: Current API doesn't accept email, so we're not including it
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get the currently logged in user's information
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/api/authentication/me`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to get current user: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    // Call the logout endpoint
    const response = await fetch(`${BASE_URL}/api/authentication/logout`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      console.warn(`Logout API call failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};