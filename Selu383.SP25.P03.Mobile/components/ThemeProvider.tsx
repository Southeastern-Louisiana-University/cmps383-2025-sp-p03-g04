import React, { createContext, useContext, ReactNode } from "react";
import { useThemeToggle, ColorSchemeName } from "../hooks/useThemeToggle";
import { Colors, UIColors } from "../styles/theme/colors";

// Define the context type
type ThemeContextType = {
  colorScheme: ColorSchemeName;
  isSystemDefault: boolean;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ColorSchemeName) => Promise<void>;
  isDark: boolean;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useThemeToggle();

  // Calculate isDark based on the color scheme
  const isDark = themeState.colorScheme === "dark";

  // Create the context value
  const contextValue: ThemeContextType = {
    ...themeState,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
