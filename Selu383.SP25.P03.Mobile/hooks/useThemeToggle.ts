import { useColorScheme as useNativeColorScheme } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ColorSchemeName = "light" | "dark";

export function useThemeToggle() {
  const systemColorScheme = useNativeColorScheme();

  const [userPreference, setUserPreference] = useState<ColorSchemeName | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

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

  const colorScheme: ColorSchemeName =
    userPreference || (systemColorScheme as ColorSchemeName) || "light";

  const toggleTheme = async () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setUserPreference(newTheme);

    try {
      await AsyncStorage.setItem("userColorScheme", newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

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
