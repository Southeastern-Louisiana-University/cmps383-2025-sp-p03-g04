import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "../components/AuthProvider";
import { loginStyles as styles } from "../styles/screens/loginScreen";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const role = await AsyncStorage.getItem("selectedRole");
        setSelectedRole(role);

        if (!role) {
          router.replace("../role-selection");
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };

    getRole();
  }, []);

  const getRoleColors = () => {
    switch (selectedRole) {
      case "staff":
        return {
          primary: "#0A7EA4",
          secondary: "#0A7EA4",
          background: "#1E2429",
          headerBg: "#0A7EA4",
        };
      case "manager":
        return {
          primary: "#C87000",
          secondary: "#C87000",
          background: "#1E2429",
          headerBg: "#C87000",
        };
      case "customer":
      default:
        return {
          primary: "#B4D335",
          secondary: "#B4D335",
          background: "#1E2429",
          headerBg: "#B4D335",
        };
    }
  };

  const { primary, background } = getRoleColors();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signIn(username, password);

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push("/register");
  };

  const navigateToForgotPassword = () => {
    router.push("../forgot-password");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
            <ThemedText style={styles.portalText}>
              {selectedRole === "customer"
                ? "Customer Portal"
                : selectedRole === "staff"
                ? "Staff Portal"
                : "Manager Portal"}
            </ThemedText>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Username</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#9BA1A6"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#9BA1A6"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9BA1A6"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9BA1A6"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.visibilityIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9BA1A6"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && {
                      backgroundColor: primary,
                      borderColor: primary,
                    },
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <ThemedText style={styles.rememberText}>Remember me</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <ThemedText style={[styles.forgotText, { color: primary }]}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText style={styles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <ThemedText style={styles.signupText}>
                Don't have an account?
              </ThemedText>
              <TouchableOpacity onPress={navigateToSignUp}>
                <ThemedText style={[styles.signupLink, { color: primary }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
