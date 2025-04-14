import { useColorScheme as useNativeColorScheme } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type for our color scheme
export type ColorSchemeName = "light" | "dark";

// Hook to manage theme state
export function useThemeToggle() {
  // Get system preference
  const systemColorScheme = useNativeColorScheme();

  // State for user preference
  const [userPreference, setUserPreference] = useState<ColorSchemeName | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preference on mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userColorScheme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setUserPreference(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  // Determine the active color scheme
  const colorScheme: ColorSchemeName =
    userPreference || (systemColorScheme as ColorSchemeName) || "light";

  // Function to toggle theme
  const toggleTheme = async () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setUserPreference(newTheme);

    try {
      await AsyncStorage.setItem("userColorScheme", newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Function to set specific theme
  const setTheme = async (theme: ColorSchemeName) => {
    setUserPreference(theme);

    try {
      await AsyncStorage.setItem("userColorScheme", theme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return {
    colorScheme,
    isSystemDefault: userPreference === null,
    isLoading,
    toggleTheme,
    setTheme,
  };
}
