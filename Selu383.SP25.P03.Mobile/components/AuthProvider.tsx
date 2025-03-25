import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth';

// Define the auth context type
export interface AuthContextType {
  user: {
    id: number;
    username: string;
    role: string;
  } | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

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
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const username = await AsyncStorage.getItem('username');
        const role = await AsyncStorage.getItem('userRole');
        
        if (id && username && role) {
          setUser({
            id: parseInt(id),
            username,
            role: role === 'Admin' ? 'manager' : role === 'Staff' ? 'staff' : 'customer'
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
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
      let appRole = 'customer';
      if (backendRole === 'Admin') appRole = 'manager';
      if (backendRole === 'Staff') appRole = 'staff';
      
      // Store auth info
      await AsyncStorage.setItem('userId', response.id.toString());
      await AsyncStorage.setItem('username', response.userName);
      await AsyncStorage.setItem('userRole', backendRole);
      
      setUser({
        id: response.id,
        username: response.userName,
        role: appRole
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('userRole');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}