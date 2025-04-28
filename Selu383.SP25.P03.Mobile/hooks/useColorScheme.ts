import { useColorScheme as useNativeColorScheme } from "react-native";

export type ColorSchemeName = "light" | "dark" | null;

export function useColorScheme(): ColorSchemeName {
  return useNativeColorScheme() as ColorSchemeName;
}
