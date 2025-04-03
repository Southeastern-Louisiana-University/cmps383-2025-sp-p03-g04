import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../components/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#B4D335",
          },
          headerTintColor: "#242424",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </AuthProvider>
  );
}
