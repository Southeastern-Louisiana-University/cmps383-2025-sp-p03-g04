import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "./ThemeProvider";
import { UIColors } from "../styles/theme/colors";

export type ThemedTextType =
  | "default"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  style?: any;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({
  style,
  type = "default",
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Default text color based on theme
  const defaultColor = isDark ? UIColors.dark.text : UIColors.light.text;

  // Use provided colors or default
  const color = isDark ? darkColor || defaultColor : lightColor || defaultColor;

  // Apply styles based on text type
  let typeStyle = {};
  switch (type) {
    case "title":
      typeStyle = {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
      };
      break;
    case "defaultSemiBold":
      typeStyle = {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
      };
      break;
    case "subtitle":
      typeStyle = {
        fontSize: 20,
        fontWeight: "bold",
      };
      break;
    case "link":
      typeStyle = {
        lineHeight: 30,
        fontSize: 16,
        color: UIColors.brandGreen,
      };
      break;
    default:
      typeStyle = {
        fontSize: 16,
        lineHeight: 24,
      };
  }

  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
}
