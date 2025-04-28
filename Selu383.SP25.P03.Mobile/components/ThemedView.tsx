import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "./ThemeProvider";
import { getBackgroundColor, getThemedColor, getUIColor } from "../utils/theme";

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  style?: any;
  variant?: "background" | "surface" | "card";
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "background",
  ...otherProps
}: ThemedViewProps) {
  const { isDark } = useTheme();

  let backgroundColor: string;

  if (lightColor && darkColor) {
    backgroundColor = getThemedColor(isDark, lightColor, darkColor);
  } else {
    switch (variant) {
      case "surface":
        backgroundColor = getUIColor(isDark, "light");
        break;
      case "card":
        backgroundColor = getUIColor(isDark, "dark");
        break;
      case "background":
      default:
        backgroundColor = getBackgroundColor(isDark);
        break;
    }
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
