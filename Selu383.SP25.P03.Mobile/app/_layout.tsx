import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
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
