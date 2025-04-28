import React, { useEffect, useState, createContext, useContext } from "react";
import * as authService from "../services/authService"; // Use the real backend service
import { UserRole } from "../types/user";
import { AuthContextType } from "../types/api/auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {
    return "customer";
  },
  signOut: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            const appRole = mapBackendRoleToAppRole(
              currentUser.roles?.[0] || "User"
            );
            setUser({
              id: currentUser.id,
              username: currentUser.userName,
              role: appRole,
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          const id = localStorage.getItem("userId");
          const username = localStorage.getItem("username");
          const role = localStorage.getItem("userRole");

          if (id && username && role) {
            const appRole = mapBackendRoleToAppRole(role);
            setUser({
              id: parseInt(id),
              username,
              role: appRole,
            });
            setIsAuthenticated(true);
          }
        }
      } catch (error: any) {
        console.error("Error loading user:", error);
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const mapBackendRoleToAppRole = (backendRole: string): UserRole => {
    switch (backendRole) {
      case "Admin":
        return "manager";
      case "Staff":
        return "staff";
      default:
        return "customer";
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      console.log("AuthContext: Starting sign in process");

      const response = await authService.login(username, password);

      console.log("AuthContext: Login response received:", response);

      const backendRole = response.roles?.[0] || "User";
      const appRole = mapBackendRoleToAppRole(backendRole);

      localStorage.setItem("userId", response.id.toString());
      localStorage.setItem("username", response.userName);
      localStorage.setItem("userRole", backendRole);

      setUser({
        id: response.id,
        username: response.userName,
        role: appRole,
      });
      setIsAuthenticated(true);

      return appRole;
    } catch (error: any) {
      console.error("Sign in error in AuthContext:", error);

      if (error.message.includes("400")) {
        throw new Error("Invalid username or password");
      } else if (error.message.includes("401")) {
        throw new Error("Invalid username or password");
      } else if (error.message.includes("500")) {
        throw new Error("Server error. Please try again later.");
      } else if (error.message.includes("404")) {
        throw new Error(
          "Authentication service not found. Please check server configuration."
        );
      } else {
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Sign out error:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
