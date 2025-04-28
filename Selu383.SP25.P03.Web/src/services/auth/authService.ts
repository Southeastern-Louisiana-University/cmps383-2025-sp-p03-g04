import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../constants/api-constants";
import { RegisterRequest, UserResponse } from "../../types/api/auth";

export const login = async (
  userName: string,
  password: string
): Promise<UserResponse> => {
  try {
    console.log("Attempting login with username:", userName);

    const response = await fetchWithCredentials<UserResponse>(
      API_ENDPOINTS.LOGIN,
      {
        method: "POST",
        body: JSON.stringify({
          userName,
          password,
        }),
      }
    );

    console.log("Login successful:", response);
    return response;
  } catch (error: any) {
    console.error("Login error details:", error);

    // If it's a network error, try to parse the response
    if (error instanceof Response) {
      try {
        const errorData = await error.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Login failed");
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }
    }

    throw error;
  }
};

export const register = async (
  data: RegisterRequest
): Promise<UserResponse> => {
  try {
    console.log("Attempting registration for:", data.username);

    const response = await fetchWithCredentials<UserResponse>(
      API_ENDPOINTS.USERS,
      {
        method: "POST",
        body: JSON.stringify({
          Username: data.username,
          Password: data.password,
          Roles: data.roles,
        }),
      }
    );

    console.log("Registration successful:", response);
    return response;
  } catch (error: any) {
    console.error("Registration error details:", error);

    // If it's a network error, try to parse the response
    if (error instanceof Response) {
      try {
        const errorData = await error.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Registration failed");
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }
    }

    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>(API_ENDPOINTS.CURRENT_USER, {
    method: "GET",
  });
};

export const logout = async (): Promise<void> => {
  return fetchWithCredentials<void>(API_ENDPOINTS.LOGOUT, {
    method: "POST",
  });
};
