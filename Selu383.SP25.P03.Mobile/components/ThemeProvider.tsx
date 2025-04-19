import React, { createContext, useContext, ReactNode } from "react";
import { useThemeToggle, ColorSchemeName } from "../hooks/useThemeToggle";
import { theme, getTheme, ThemeType } from "../styles/theme/theme";

// Define the context type
type ThemeContextType = {
  colorScheme: ColorSchemeName;
  isSystemDefault: boolean;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ColorSchemeName) => Promise<void>;
  theme: ThemeType; // Add the theme object
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useThemeToggle();
  const isDark = themeState.colorScheme === "dark";

  // Get the appropriate theme based on the color scheme
  const currentTheme = {
    ...(isDark ? theme.dark : theme.light),
    shared: theme.shared,
  };

  return (
    <ThemeContext.Provider
      value={{
        ...themeState,
        theme: currentTheme,
      }}
    >
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
