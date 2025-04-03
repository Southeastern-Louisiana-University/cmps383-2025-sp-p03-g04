import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/auth/authService";
import { AuthContextType } from "../types/components/uiComponents";
import { User, UserRole } from "../types/models/user";
import { UserResponse } from "../types/api/auth";

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        const role = await AsyncStorage.getItem("userRole");

        if (id && username && role) {
          setUser({
            id: parseInt(id),
            username,
            role:
              role === "Admin"
                ? "manager"
                : role === "Staff"
                ? "staff"
                : "customer",
          });
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

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);

      // Get role from backend
      const backendRole = response.roles[0];

      // Convert backend role to app role
      let appRole = "customer";
      if (backendRole === "Admin") appRole = "manager";
      if (backendRole === "Staff") appRole = "staff";

      // Store auth info
      await AsyncStorage.setItem("userId", response.id.toString());
      await AsyncStorage.setItem("username", response.userName);
      await AsyncStorage.setItem("userRole", backendRole);

      setUser({
        id: response.id,
        username: response.userName,
        role: appRole,
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // First clear local storage, this way even if the API call fails, we're still logged out locally
      await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
      setUser(null);

      // Then attempt the API call, but don't wait for it to complete before updating the UI
      authService.logout().catch((error: any) => {
        console.error("API logout error (ignored):", error);
        // We already cleared local storage above, so we can ignore this error
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Make sure we're logged out locally even if there's an error
      setUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}