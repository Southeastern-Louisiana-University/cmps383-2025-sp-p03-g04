import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/auth/authService";
import { AuthContextType } from "../types/components/uiComponents";
import { User, UserRole } from "../types/models/user";

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async (username: string, password: string) => {
    return "customer";
  },
  signOut: async () => {},
  signUp: async (username: string, password: string, email?: string) => {
    return "customer";
  },
  isAuthenticated: false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        const role = await AsyncStorage.getItem("userRole");

        if (id && username && role) {
          // Map backend roles to app roles
          const appRole = mapBackendRoleToAppRole(role);

          setUser({
            id: parseInt(id),
            username,
            role: appRole,
          });
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error("Error loading user:", error);
        // Clear any partial data in case of error
        await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Helper to map backend roles to app roles
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

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);

      // Get role from backend
      const backendRole = response.roles[0];
      const appRole = mapBackendRoleToAppRole(backendRole);

      // Store auth info
      await AsyncStorage.setItem("userId", response.id.toString());
      await AsyncStorage.setItem("username", response.userName);
      await AsyncStorage.setItem("userRole", backendRole);

      setUser({
        id: response.id,
        username: response.userName,
        role: appRole,
      });
      setIsAuthenticated(true);

      return appRole;
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (username: string, password: string, email?: string) => {
    try {
      // Default to customer role for new registrations
      const response = await authService.register({
        username,
        password,
        email: email || "",
        roles: ["User"], // Always register as a User/Customer
      });

      // Auto sign in after registration
      return await signIn(username, password);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // First clear local storage, this way even if the API call fails, we're still logged out locally
      await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
      setUser(null);
      setIsAuthenticated(false);

      // Then attempt the API call, but don't wait for it to complete before updating the UI
      authService.logout().catch((error: any) => {
        console.error("API logout error (ignored):", error);
        // We already cleared local storage above, so we can ignore this error
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Make sure we're logged out locally even if there's an error
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        signUp,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
