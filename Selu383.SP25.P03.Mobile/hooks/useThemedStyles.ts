import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { UIColors } from "../styles/theme/colors";

/**
 * Creates themed styles based on the current theme.
 *
 * @param styleCreator A function that takes the current theme (dark/light) and returns a StyleSheet
 * @returns The themed styles
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (isDark: boolean, colors: typeof UIColors) => T
): T {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Memoize the styles to avoid recalculating on every render
  return useMemo(() => {
    // Create theme-specific styles
    const themeColors = isDark ? UIColors.dark : UIColors.light;

    // Get the styles from the creator function
    const styles = styleCreator(isDark, UIColors);

    // Create the stylesheet
    return StyleSheet.create(styles);
  }, [isDark, styleCreator]);
}

/**
 * Helper function to create a themed style function
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (isDark: boolean, colors: typeof UIColors) => T
): (isDark: boolean, colors: typeof UIColors) => T {
  return styleCreator;
}
