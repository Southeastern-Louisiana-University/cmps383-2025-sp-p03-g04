import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "./ThemeProvider";
import { getBackgroundColor, getUIColor } from "../utils/themeUtils";

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

  // Determine the background color based on variant or custom colors
  let backgroundColor: string;

  if (lightColor && darkColor) {
    // Use custom colors if provided
    backgroundColor = isDark ? darkColor : lightColor;
  } else {
    // Otherwise use variant-based colors
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
