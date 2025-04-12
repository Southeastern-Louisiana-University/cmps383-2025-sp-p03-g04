import React, { ReactNode } from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "../ThemeProvider";
import { UIColors } from "../../styles/theme/colors";

interface ThemedCardProps extends ViewProps {
  children: ReactNode;
  elevation?: "none" | "low" | "medium" | "high";
  variant?: "filled" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
  borderRadius?: "none" | "small" | "medium" | "large";
}

export function ThemedCard({
  children,
  elevation = "low",
  variant = "filled",
  padding = "medium",
  borderRadius = "medium",
  style,
  ...rest
}: ThemedCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Get the appropriate background and border colors based on theme
  const backgroundColor = isDark
    ? variant === "filled"
      ? UIColors.dark.card
      : "transparent"
    : variant === "filled"
    ? UIColors.light.card
    : "transparent";

  const borderColor = isDark
    ? variant === "outlined"
      ? UIColors.dark.border
      : "transparent"
    : variant === "outlined"
    ? UIColors.light.border
    : "transparent";

  // Get elevation styles
  const elevationStyle = getElevationStyle(elevation, isDark);

  // Get padding styles
  const paddingStyle = getPaddingStyle(padding);

  // Get border radius styles
  const borderRadiusStyle = getBorderRadiusStyle(borderRadius);

  // Combine all styles
  const cardStyle = [
    styles.card,
    { backgroundColor, borderColor },
    variant === "outlined" && styles.outlined,
    elevationStyle,
    paddingStyle,
    borderRadiusStyle,
    style,
  ];

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

// Helper functions to get styles
function getElevationStyle(
  elevation: ThemedCardProps["elevation"],
  isDark: boolean
) {
  // Darker shadow for light mode, lighter shadow for dark mode
  const shadowColor = isDark ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.25)";

  switch (elevation) {
    case "none":
      return {};

    case "low":
      return {
        shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.2,
        shadowRadius: 2,
        elevation: 2,
      };

    case "medium":
      return {
        shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.5 : 0.3,
        shadowRadius: 4,
        elevation: 4,
      };

    case "high":
      return {
        shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.7 : 0.4,
        shadowRadius: 8,
        elevation: 8,
      };

    default:
      return {};
  }
}

function getPaddingStyle(padding: ThemedCardProps["padding"]) {
  switch (padding) {
    case "none":
      return { padding: 0 };

    case "small":
      return { padding: 8 };

    case "large":
      return { padding: 24 };

    case "medium":
    default:
      return { padding: 16 };
  }
}

function getBorderRadiusStyle(borderRadius: ThemedCardProps["borderRadius"]) {
  switch (borderRadius) {
    case "none":
      return { borderRadius: 0 };

    case "small":
      return { borderRadius: 4 };

    case "large":
      return { borderRadius: 16 };

    case "medium":
    default:
      return { borderRadius: 8 };
  }
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  outlined: {
    borderWidth: 1,
  },
});
