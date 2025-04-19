import { Colors } from "./colors";

// Create a unified theme object
export const theme = {
  // Light theme
  light: {
    // Base colors
    background: Colors.light.background,
    surface: Colors.light.card,
    text: {
      primary: Colors.light.text,
      secondary: Colors.light.gray6,
      accent: Colors.light.primary,
      inverse: Colors.dark.text,
    },
    border: Colors.light.border,
    
    // UI element colors
    button: {
      primary: {
        background: Colors.light.primary,
        text: "#242424", // Dark text on light button
        disabled: Colors.light.gray3,
      },
      secondary: {
        background: Colors.light.secondary,
        text: Colors.light.text,
        disabled: Colors.light.gray3,
      },
      outline: {
        border: Colors.light.primary,
        text: Colors.light.primary,
        disabled: Colors.light.gray3,
      },
    },
    
    // Navigation colors
    navigation: {
      background: Colors.light.background,
      active: Colors.light.primary,
      inactive: Colors.light.gray5,
    },
    
    // Semantic colors
    status: {
      success: Colors.light.success,
      warning: Colors.light.warning,
      error: Colors.light.danger,
      info: Colors.light.info,
    },
    
    // Media colors
    media: {
      poster: {
        shadow: "rgba(180, 211, 53, 0.3)",
      },
    },
    
    // Movie ticket booking colors
    booking: {
      seat: {
        available: Colors.light.secondary,
        selected: Colors.light.primary,
        taken: Colors.light.gray6,
        text: Colors.light.text,
      },
      screen: "#0A7EA4",
    },
  },
  
  // Dark theme
  dark: {
    // Base colors
    background: Colors.dark.background,
    surface: Colors.dark.card,
    text: {
      primary: Colors.dark.text,
      secondary: Colors.dark.gray6,
      accent: Colors.dark.primary,
      inverse: Colors.light.text,
    },
    border: Colors.dark.border,
    
    // UI element colors
    button: {
      primary: {
        background: Colors.dark.primary,
        text: "#242424", // Dark text on dark button
        disabled: Colors.dark.gray3,
      },
      secondary: {
        background: Colors.dark.secondary,
        text: Colors.dark.text,
        disabled: Colors.dark.gray3,
      },
      outline: {
        border: Colors.dark.primary,
        text: Colors.dark.primary,
        disabled: Colors.dark.gray3,
      },
    },
    
    // Navigation colors
    navigation: {
      background: "#1E2429",
      active: Colors.dark.primary,
      inactive: Colors.dark.gray5,
    },
    
    // Semantic colors
    status: {
      success: Colors.dark.success,
      warning: Colors.dark.warning,
      error: Colors.dark.danger,
      info: Colors.dark.info,
    },
    
    // Media colors
    media: {
      poster: {
        shadow: "rgba(180, 211, 53, 0.2)",
      },
    },
    
    // Movie ticket booking colors
    booking: {
      seat: {
        available: Colors.dark.secondary,
        selected: Colors.dark.primary,
        taken: Colors.dark.gray6,
        text: Colors.dark.text,
      },
      screen: "#0A7EA4",
    },
  },
  
  // Shared (theme-agnostic) values
  shared: {
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 24,
      round: 9999, // For circular elements
    },
    typography: {
      fontSize: {
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      lineHeight: {
        xs: 16,
        s: 20,
        m: 24,
        l: 28,
        xl: 32,
        xxl: 36,
        xxxl: 40,
      },
    },
  },
};

// Convenience function to get the correct theme based on mode
export const getTheme = (mode: "light" | "dark") => {
  return mode === "light" ? theme.light : theme.dark;
};

// Type definitions for theme to enable TypeScript auto-completion
export type ThemeType = typeof theme.light & {
  shared: typeof theme.shared;
};