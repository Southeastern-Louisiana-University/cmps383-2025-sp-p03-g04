import React, { createContext, useContext, ReactNode } from "react";
import { useThemeToggle, ColorSchemeName } from "../hooks/useThemeToggle";

// Define the context type
type ThemeContextType = {
  colorScheme: ColorSchemeName;
  isSystemDefault: boolean;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ColorSchemeName) => Promise<void>;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useThemeToggle();

  return (
    <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
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
