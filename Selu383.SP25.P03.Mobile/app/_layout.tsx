// import React from "react";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { AuthProvider } from "../components/AuthProvider";
// import { ThemeProvider, useTheme } from "../components/ThemeProvider";
// import { UIColors } from "../styles/theme/colors";
// import * as SplashScreen from "expo-splash-screen";

// // Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// // Layout component that uses the theme
// function AppLayout() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   // Get appropriate colors based on theme
//   const headerBgColor = isDark ? UIColors.dark.navBar : UIColors.light.navBar;
//   const headerTintColor = isDark ? UIColors.dark.text : UIColors.light.text;

//   return (
//     <>
//       <StatusBar style={isDark ? "light" : "dark"} />
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: headerBgColor,
//           },
//           headerTintColor: headerTintColor,
//           headerTitleStyle: {
//             fontWeight: "bold",
//           },
//           // Add other global screen options here
//           contentStyle: {
//             backgroundColor: isDark
//               ? UIColors.dark.background
//               : UIColors.light.background,
//           },
//         }}
//       />
//     </>
//   );
// }

// // Root layout that provides theme and auth contexts
// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <AppLayout />
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AuthProvider } from "../components/AuthProvider";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";

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
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
