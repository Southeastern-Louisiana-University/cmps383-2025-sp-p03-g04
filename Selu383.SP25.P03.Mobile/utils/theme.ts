import { Colors, UIColors } from "../styles/theme/colors";

// Get the base text color based on theme
export const getTextColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.text : Colors.light.text;
};

// Get the base background color based on theme
export const getBackgroundColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.background : Colors.light.background;
};

// Get a theme-specific color based on light/dark mode
export const getThemedColor = (
  isDark: boolean,
  lightColor: string,
  darkColor: string
): string => {
  return isDark ? darkColor : lightColor;
};

// Get a UI color based on theme
export const getUIColor = (
  isDark: boolean,
  variant: "light" | "dark"
): string => {
  return isDark
    ? variant === "light"
      ? UIColors.dark.surface
      : UIColors.dark.card
    : variant === "light"
    ? UIColors.light.surface
    : UIColors.light.card;
};

// Get a color from the theme palette
export const getColorFromTheme = (
  isDark: boolean,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string => {
  return isDark ? Colors.dark[colorName] : Colors.light[colorName];
};
