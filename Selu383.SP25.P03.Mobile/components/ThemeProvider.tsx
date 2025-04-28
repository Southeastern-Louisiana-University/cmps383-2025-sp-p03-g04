import React, { createContext, useContext, ReactNode } from "react";
import { useThemeToggle, ColorSchemeName } from "../hooks/useThemeToggle";

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  isSystemDefault: boolean;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ColorSchemeName) => Promise<void>;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useThemeToggle();

  const isDark = themeState.colorScheme === "dark";

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

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
