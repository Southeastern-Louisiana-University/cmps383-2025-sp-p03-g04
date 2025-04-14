import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function ProfileScreen() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Profile" }} />

      {isAuthenticated && user ? (
        // Authenticated user view
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.profileCircle}>
              <ThemedText style={styles.profileInitial}>
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </ThemedText>
            </View>
            <ThemedText style={styles.username}>
              {user.username || "User"}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/tickets")}
          >
            <Ionicons name="ticket-outline" size={24} color="#B4D335" />
            <ThemedText style={styles.menuItemText}>My Tickets</ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#666666" : "#999999"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="white" />
            <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        // Guest user view
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#B4D335" />
          <ThemedText style={styles.loginTitle}>
            Sign in to your account
          </ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Sign in to view your profile and manage your tickets.
          </ThemedText>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Theme toggle */}
      <ThemeToggle position="bottomRight" size={40} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(180, 211, 53, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#B4D335",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262D33",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  loginSubtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#9BA1A6",
  },
  loginButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#1E2429",
    fontWeight: "bold",
    fontSize: 16,
  },
});
