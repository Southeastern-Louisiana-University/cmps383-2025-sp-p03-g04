import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeProvider";
import { UIColors } from "../styles/theme/colors";

interface ThemeToggleProps {
  size?: number;
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
}

export function ThemeToggle({
  size = 40,
  position = "bottomRight",
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const positionStyle = getPositionStyle(position);

  return (
    <View style={[styles.container, positionStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.15)",
          },
        ]}
        onPress={toggleTheme}
        accessibilityLabel={
          isDark ? "Switch to light mode" : "Switch to dark mode"
        }
        accessibilityRole="button"
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={size * 0.6}
          color={isDark ? UIColors.brandGreen : "#1E2429"}
        />
      </TouchableOpacity>
    </View>
  );
}

function getPositionStyle(position: ThemeToggleProps["position"]) {
  switch (position) {
    case "bottomLeft":
      return styles.bottomLeft;
    case "topRight":
      return styles.topRight;
    case "topLeft":
      return styles.topLeft;
    case "bottomRight":
    default:
      return styles.bottomRight;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 999,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
  },
  topRight: {
    top: 20,
    right: 20,
  },
  topLeft: {
    top: 20,
    left: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
