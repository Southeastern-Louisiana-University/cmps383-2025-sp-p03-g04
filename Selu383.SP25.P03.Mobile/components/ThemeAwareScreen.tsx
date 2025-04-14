import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { UIColors } from "../styles/theme/colors";

interface ThemeAwareScreenProps {
  children: ReactNode;
  showThemeToggle?: boolean;
  togglePosition?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  style?: any;
}

export function ThemeAwareScreen({
  children,
  showThemeToggle = true,
  togglePosition = "bottomRight",
  style,
}: ThemeAwareScreenProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Get the appropriate background color based on theme
  const backgroundColor = isDark
    ? UIColors.dark.background
    : UIColors.light.background;

  return (
    <ThemedView style={[styles.container, { backgroundColor }, style]}>
      {children}

      {showThemeToggle && <ThemeToggle position={togglePosition} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
