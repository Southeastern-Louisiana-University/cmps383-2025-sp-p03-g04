import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../services/auth/authService";
import { AuthContextType } from "../types/components/uiComponents";
import { User, UserRole } from "../types/models/user";

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

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        const role = await AsyncStorage.getItem("userRole");

        if (id && username && role) {
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
        await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
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
      const response = await authService.login(username, password);

      const backendRole = response.roles[0];
      const appRole = mapBackendRoleToAppRole(backendRole);

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

  const signUp = async (username: string, password: string, email?: string) => {
    try {
      const response = await authService.register({
        username,
        password,
        email: email || "",
        roles: ["User"],
      });

      return await signIn(username, password);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(["userId", "username", "userRole"]);
      setUser(null);
      setIsAuthenticated(false);

      authService.logout().catch((error: any) => {
        console.error("API logout error (ignored):", error);
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
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
