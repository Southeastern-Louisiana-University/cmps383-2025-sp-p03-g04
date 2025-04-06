import { useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";

export default function Index() {
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2429",
  },
  loadingText: {
    marginTop: 10,
    color: "#9BA1A6",
  },
});
