import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "./ThemeProvider";
import { getTextColor, getThemedColor } from "../utils/theme";
import { Colors } from "../styles/theme/colors";

export type ThemedTextType =
  | "default"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link"
  | "caption"
  | "button";

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
  const { isDark } = useTheme();

  const defaultColor = getTextColor(isDark);

  const color =
    lightColor && darkColor
      ? getThemedColor(isDark, lightColor, darkColor)
      : defaultColor;

  let typeStyle = {};
  switch (type) {
    case "title":
      typeStyle = {
        fontSize: 24,
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
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 28,
      };
      break;
    case "link":
      typeStyle = {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.light.primary,
        textDecorationLine: "underline",
      };
      break;
    case "caption":
      typeStyle = {
        fontSize: 12,
        lineHeight: 16,
        color: isDark ? Colors.dark.gray5 : Colors.light.gray5,
      };
      break;
    case "button":
      typeStyle = {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 24,
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
