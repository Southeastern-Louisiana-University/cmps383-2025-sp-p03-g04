import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "./ThemeProvider";
import { UIColors } from "../styles/theme/colors";

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  style?: any;
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Determine the background color
  const defaultBgColor = isDark
    ? UIColors.dark.background
    : UIColors.light.background;
  const backgroundColor = isDark
    ? darkColor || defaultBgColor
    : lightColor || defaultBgColor;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
