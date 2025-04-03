import { useColorScheme as useNativeColorScheme } from "react-native";

// Type for possible color schemes
export type ColorSchemeName = "light" | "dark" | null;

/**
 * This hook returns the user's preferred color scheme,
 * helping to determine whether to use light or dark themed components.
 * Returns 'light', 'dark', or null if no preference is provided.
 */
export function useColorScheme(): ColorSchemeName {
  return useNativeColorScheme() as ColorSchemeName;
}
