import { Colors, UIColors } from "../styles/theme/colors";

export const getTextColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.text : Colors.light.text;
};

export const getBackgroundColor = (isDark: boolean): string => {
  return isDark ? Colors.dark.background : Colors.light.background;
};

export const getThemedColor = (
  isDark: boolean,
  lightColor: string,
  darkColor: string
): string => {
  return isDark ? darkColor : lightColor;
};

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

export const getColorFromTheme = (
  isDark: boolean,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string => {
  return isDark ? Colors.dark[colorName] : Colors.light[colorName];
};
