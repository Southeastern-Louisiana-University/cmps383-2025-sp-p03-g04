import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../../src/constants/api-constants";
import { RegisterRequest, UserResponse } from "../../types/api/auth";

export const login = async (
  userName: string,
  password: string
): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify({
      userName,
      password,
    }),
  });
};

export const register = async (
  data: RegisterRequest
): Promise<UserResponse> => {
  return fetchWithCredentials<UserResponse>(API_ENDPOINTS.USERS, {
    method: "POST",
    body: JSON.stringify({
      Username: data.username,
      Password: data.password,
      Roles: data.roles,
    }),
  });
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
