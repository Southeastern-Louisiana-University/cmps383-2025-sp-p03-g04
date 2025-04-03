import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../components/AuthProvider";
import { profileScreenStyles as styles } from "../../styles/screens/profileScreen";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    AsyncStorage.setItem("userColorScheme", !darkMode ? "dark" : "light");
  };

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

            // Force navigation to role selection
            router.push("/role-selection");
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
              value={darkMode}
              onValueChange={handleDarkModeToggle}
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
