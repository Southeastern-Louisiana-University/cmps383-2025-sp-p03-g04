// import React from "react";
// import { Stack } from "expo-router";
// import { AuthProvider } from "../components/AuthProvider";

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: "#B4D335",
//           },
//           headerTintColor: "#242424",
//           headerTitleStyle: {
//             fontWeight: "bold",
//           },
//         }}
//       />
//     </AuthProvider>
//   );
// }

import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../components/AuthProvider";
import { ThemeProvider } from "../components/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#1E2429", // Dark background for headers
            },
            headerTintColor: "#B4D335", // Lion's Den green for text/icons
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: "#121212", // Dark mode background
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
