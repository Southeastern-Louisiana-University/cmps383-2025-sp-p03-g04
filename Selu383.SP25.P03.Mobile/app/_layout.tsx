import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { AuthProvider } from "../components/AuthProvider";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";
import { BookingProvider } from "../components/BookingProvider";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#1E2429",
          contentStyle: {
            backgroundColor: isDark ? "#121212" : "#FFFFFF",
          },
          // Add this to remove default route names in the header
          headerTitle: ({ children }) => {
            // Remove file extensions and route patterns from titles
            if (typeof children === "string") {
              // Remove file extensions (.tsx, .ts)
              const withoutExtension = children.replace(/\.(tsx|ts)$/, "");
              // Remove route patterns like [id], (tabs)
              const cleanTitle = withoutExtension
                .replace(/\[\w+\]/, "")
                .replace(/\(\w+\)/, "")
                .trim();

              return cleanTitle ? (
                <Text style={{ color: isDark ? "#FFFFFF" : "#1E2429" }}>
                  {cleanTitle}
                </Text>
              ) : null;
            }
            return children;
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificial delay for testing
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <AppLayout />
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
