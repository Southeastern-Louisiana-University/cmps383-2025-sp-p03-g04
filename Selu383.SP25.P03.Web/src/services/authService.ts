const BASE_URL = "/api/authentication";

export interface LoginData {
  userName: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  roles: string[];
}

export interface UserDto {
  id: number;
  userName: string;
  roles: string[];
}

export const login = async (
  username: string,
  password: string
): Promise<UserDto> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userName: username, // Make sure the casing matches the backend
        password: password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Login failed");
    }

    return response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserDto | null> => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
};

export const register = async (
  username: string,
  password: string,
  roles: string[] = ["User"]
): Promise<UserDto> => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
        roles: roles,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Registration failed");
    }

    return response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
