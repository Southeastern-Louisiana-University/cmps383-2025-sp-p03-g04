import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../components/AuthProvider";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";
import { UIColors } from "../styles/theme/colors";

// Layout component that uses the theme
function AppLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Get appropriate colors based on theme
  const headerBgColor = isDark ? UIColors.dark.navBar : UIColors.light.navBar;
  const headerTintColor = isDark ? UIColors.dark.text : UIColors.light.text;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: headerBgColor,
          },
          headerTintColor: headerTintColor,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // Add other global screen options here
          contentStyle: {
            backgroundColor: isDark
              ? UIColors.dark.background
              : UIColors.light.background,
          },
        }}
      />
    </>
  );
}

// Root layout that provides theme and auth contexts
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
