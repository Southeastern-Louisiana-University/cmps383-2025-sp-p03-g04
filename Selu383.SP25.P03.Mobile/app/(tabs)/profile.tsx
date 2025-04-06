import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/AuthProvider";
import { ThemeProvider, useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { profileScreenStyles as styles } from "../../styles/screens/profileScreen";

export default function ProfileScreen() {
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            setIsProcessing(true);
            await signOut();

            // Force navigation to home
            router.replace("/(tabs)");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        },
      },
    ]);
  };

  const handleLogin = () => {
    router.push("/login?returnTo=/profile");
  };

  // If user is not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Profile" }} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons name="person-circle-outline" size={100} color="#B4D335" />
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Sign in to your account
          </ThemedText>
          <ThemedText
            style={{ textAlign: "center", marginBottom: 30, color: "#9BA1A6" }}
          >
            Create an account or sign in to view your profile, tickets, and
            manage your preferences.
          </ThemedText>
          <TouchableOpacity
            style={{
              backgroundColor: "#B4D335",
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 8,
              marginBottom: 16,
            }}
            onPress={handleLogin}
          >
            <ThemedText
              style={{ color: "#1E2429", fontWeight: "bold", fontSize: 16 }}
            >
              Sign In
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#B4D335",
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 8,
            }}
            onPress={() => router.push("/register")}
          >
            <ThemedText
              style={{ color: "#B4D335", fontWeight: "bold", fontSize: 16 }}
            >
              Create Account
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // Get role-specific settings sections
  const getRoleSettings = () => {
    switch (user?.role) {
      case "customer":
        return (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#B4D335"
                />
                <ThemedText style={styles.settingLabel}>
                  Push Notifications
                </ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#3e3e3e", true: "#B4D335" }}
                thumbColor={"#f4f3f4"}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Ionicons name="film-outline" size={22} color="#B4D335" />
                <ThemedText style={styles.settingLabel}>
                  Theater Mode
                </ThemedText>
              </View>
              <Switch
                value={theaterMode}
                onValueChange={setTheaterMode}
                trackColor={{ false: "#3e3e3e", true: "#B4D335" }}
                thumbColor={"#f4f3f4"}
              />
            </View>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./payment-methods")}
            >
              <Ionicons name="card-outline" size={22} color="#B4D335" />
              <ThemedText style={styles.settingButtonText}>
                Payment Methods
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./purchase-history")}
            >
              <Ionicons name="receipt-outline" size={22} color="#B4D335" />
              <ThemedText style={styles.settingButtonText}>
                Purchase History
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>
          </>
        );

      case "staff":
        return (
          <>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./staff/settings/shifts")}
            >
              <Ionicons name="time-outline" size={22} color="#0A7EA4" />
              <ThemedText style={styles.settingButtonText}>
                My Shifts
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./staff/settings/tasks")}
            >
              <Ionicons name="list-outline" size={22} color="#0A7EA4" />
              <ThemedText style={styles.settingButtonText}>
                Task History
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./staff/settings/performance")}
            >
              <Ionicons name="stats-chart-outline" size={22} color="#0A7EA4" />
              <ThemedText style={styles.settingButtonText}>
                Performance
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>
          </>
        );

      case "manager":
        return (
          <>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./admin/settings/theaters")}
            >
              <Ionicons name="business-outline" size={22} color="#C87000" />
              <ThemedText style={styles.settingButtonText}>
                Theater Management
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./admin/settings/users")}
            >
              <Ionicons name="people-outline" size={22} color="#C87000" />
              <ThemedText style={styles.settingButtonText}>
                User Management
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={() => router.push("./admin/settings/api")}
            >
              <Ionicons name="code-slash-outline" size={22} color="#C87000" />
              <ThemedText style={styles.settingButtonText}>
                API Settings
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#666666"
                style={styles.chevron}
              />
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  // Get theme color for header based on role
  const getHeaderColor = () => {
    switch (user?.role) {
      case "staff":
        return "#0A7EA4";
      case "manager":
        return "#C87000";
      case "customer":
      default:
        return "#B4D335";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Profile" }} />
      <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
        <View style={styles.profileCircle}>
          <ThemedText style={styles.profileInitial}>
            {user?.username.charAt(0).toUpperCase() || "U"}
          </ThemedText>
        </View>
        <ThemedText style={styles.username}>
          {user?.username || "User"}
        </ThemedText>
        <ThemedText style={styles.roleText}>
          {user?.role === "customer"
            ? "Customer"
            : user?.role === "staff"
            ? "Staff Member"
            : "Manager"}
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push("./edit-profile")}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={getHeaderColor()}
            />
            <ThemedText style={styles.settingButtonText}>
              Edit Profile
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666666"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push("./change-password")}
          >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={getHeaderColor()}
            />
            <ThemedText style={styles.settingButtonText}>
              Change Password
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666666"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="moon-outline"
                size={22}
                color={getHeaderColor()}
              />
              <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#3e3e3e", true: getHeaderColor() }}
              thumbColor={"#f4f3f4"}
            />
          </View>

          {getRoleSettings()}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push("./help-support")}
          >
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={getHeaderColor()}
            />
            <ThemedText style={styles.settingButtonText}>
              Help & Support
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666666"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push("./terms-conditions")}
          >
            <Ionicons
              name="document-text-outline"
              size={22}
              color={getHeaderColor()}
            />
            <ThemedText style={styles.settingButtonText}>
              Terms & Conditions
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666666"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push("./privacy-policy")}
          >
            <Ionicons
              name="shield-outline"
              size={22}
              color={getHeaderColor()}
            />
            <ThemedText style={styles.settingButtonText}>
              Privacy Policy
            </ThemedText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666666"
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isProcessing && styles.disabledButton]}
          onPress={handleLogout}
          disabled={isProcessing}
        >
          <Ionicons name="log-out-outline" size={22} color="white" />
          <ThemedText style={styles.logoutButtonText}>
            {isProcessing ? "Logging out..." : "Log Out"}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
