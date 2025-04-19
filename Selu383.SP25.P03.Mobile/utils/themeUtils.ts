import { Colors, UIColors } from "../styles/theme/colors";
import { Spacing, BorderRadius } from "../styles/theme/spacing";

/**
 * Get color value based on theme
 *
 * @param isDark Whether dark mode is active
 * @param lightColor Light mode color
 * @param darkColor Dark mode color
 * @returns The appropriate color for the current theme
 */
export const getThemedColor = (
  isDark: boolean,
  lightColor: string,
  darkColor: string
): string => {
  return isDark ? darkColor : lightColor;
};

/**
 * Get the UI color for a specific element
 *
 * @param isDark Whether dark mode is active
 * @param colorKey Key in the UIColors object
 * @returns The appropriate color for the specified UI element
 */
export const getUIColor = (
  isDark: boolean,
  colorKey: keyof typeof UIColors
): string => {
  return (UIColors[isDark ? "dark" : "light"] as any)[colorKey] || UIColors.brandGreen;
};

/**
 * Get background color for the current theme
 *
 * @param isDark Whether dark mode is active
 * @returns Background color for the current theme
 */
export const getBackgroundColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.background : Colors.light.background;
};

/**
 * Get text color for the current theme
 *
 * @param isDark Whether dark mode is active
 * @returns Text color for the current theme
 */
export const getTextColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.text : Colors.light.text;
};

/**
 * Get border color for the current theme
 *
 * @param isDark Whether dark mode is active
 * @returns Border color for the current theme
 */
export const getBorderColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.border : Colors.light.border;
};

/**
 * Get spacing value
 *
 * @param size Spacing size key
 * @returns The numeric spacing value
 */
export const getSpacing = (size: keyof typeof Spacing): number => {
  return Spacing[size];
};

/**
 * Get border radius value
 *
 * @param size Border radius size key
 * @returns The numeric border radius value
 */
export const getBorderRadius = (size: keyof typeof BorderRadius): number => {
  return BorderRadius[size];
};

// Theme object for ThemedView and ThemedText components
export const getThemeProps = (isDark: boolean) => ({
  backgroundColor: getBackgroundColor(isDark),
  textColor: getTextColor(isDark),
  borderColor: getBorderColor(isDark),
  primaryColor: UIColors.brandGreen,
  secondaryColor: isDark ? Colors.dark.secondary : Colors.light.secondary,
  cardColor: isDark ? Colors.dark.card : Colors.light.card,
});
