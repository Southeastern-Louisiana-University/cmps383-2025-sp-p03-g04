import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define theme context type
type ThemeContextType = {
  isDarkMode: boolean;
  isTheaterMode: boolean;
  toggleDarkMode: () => void;
  toggleTheaterMode: () => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  isTheaterMode: false,
  toggleDarkMode: () => {},
  toggleTheaterMode: () => {},
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === "dark");
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("userColorScheme");
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "dark");
        }

        const storedTheaterMode = await AsyncStorage.getItem("theaterMode");
        if (storedTheaterMode !== null) {
          setIsTheaterMode(storedTheaterMode === "true");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem("userColorScheme", newMode ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Toggle theater mode
  const toggleTheaterMode = async () => {
    const newMode = !isTheaterMode;
    setIsTheaterMode(newMode);
    try {
      await AsyncStorage.setItem("theaterMode", newMode ? "true" : "false");
    } catch (error) {
      console.error("Error saving theater mode preference:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        isTheaterMode,
        toggleDarkMode,
        toggleTheaterMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
