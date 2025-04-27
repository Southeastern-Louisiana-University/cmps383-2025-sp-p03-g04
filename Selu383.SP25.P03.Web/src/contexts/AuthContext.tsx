import React, { useEffect, useState, createContext, useContext } from "react";
import * as authService from "../services/auth/authService";
import { UserRole } from "../types/user";
import { AuthContextType } from "../types/api/auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {
    return "customer";
  },
  signOut: async () => {},
  signUp: async () => {
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
        const id = await localStorage.getItem("userId");
        const username = await localStorage.getItem("username");
        const role = await localStorage.getItem("userRole");

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

        await localStorage.multiRemove(["userId", "username", "userRole"]);
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

      await localStorage.setItem("userId", response.id.toString());
      await localStorage.setItem("username", response.userName);
      await localStorage.setItem("userRole", backendRole);

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
      await authService.register({
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
      await localStorage.multiRemove(["userId", "username", "userRole"]);
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
