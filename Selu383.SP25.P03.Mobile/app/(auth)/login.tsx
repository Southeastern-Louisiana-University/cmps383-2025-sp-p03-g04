import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/AuthProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { loginStyles as styles } from "../../styles/screens/loginScreen";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as string | undefined;

  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if we have saved credentials
    const checkSavedCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("savedUsername");
        if (savedUsername) {
          setUsername(savedUsername);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error checking saved credentials:", error);
      }
    };

    checkSavedCredentials();
  }, []);

  const handleAuth = async () => {
    setError("");

    // Validate inputs
    if (!username) {
      setError("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!isLogin) {
      // Additional validation for registration
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const role = await signIn(username, password);

        // Save username if remember me is checked
        if (rememberMe) {
          await AsyncStorage.setItem("savedUsername", username);
        } else {
          await AsyncStorage.removeItem("savedUsername");
        }

        // Navigation after successful login
        if (returnTo) {
          router.push(returnTo as any);
        } else {
          router.push("/");
        }
      } else {
        // Register
        const role = await signUp(username, password, email);

        // Navigate home after successful registration
        if (returnTo) {
          router.push(returnTo as any);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(
        isLogin
          ? "Invalid username or password"
          : "Registration failed. Please try again with a different username."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const navigateToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isLogin ? "Sign In" : "Create Account",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTitleStyle: {
            color: "#FFFFFF",
          },
          headerTintColor: "#B4D335",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="film-outline"
                size={80}
                color="#B4D335"
                style={{ marginBottom: 16 }}
              />
              <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
              <ThemedText style={styles.subtitle}>
                {isLogin ? "Welcome back" : "Create your account"}
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

              {!isLogin && (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Email (Optional)
                  </ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#9BA1A6"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#9BA1A6"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

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

              {!isLogin && (
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Confirm Password
                  </ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#9BA1A6"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9BA1A6"
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              {isLogin && (
                <View style={styles.rememberContainer}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && {
                          backgroundColor: "#B4D335",
                          borderColor: "#B4D335",
                        },
                      ]}
                    >
                      {rememberMe && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <ThemedText style={styles.rememberText}>
                      Remember me
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={navigateToForgotPassword}>
                    <ThemedText style={styles.forgotText}>
                      Forgot Password?
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.authButton, isLoading && styles.disabledButton]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ThemedText style={styles.authButtonText}>
                    {isLogin ? "Sign In" : "Create Account"}
                  </ThemedText>
                )}
              </TouchableOpacity>

              <View style={styles.toggleContainer}>
                <ThemedText style={styles.toggleText}>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </ThemedText>
                <TouchableOpacity onPress={toggleAuthMode}>
                  <ThemedText style={styles.toggleLink}>
                    {isLogin ? "Sign Up" : "Sign In"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Skip login button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                if (returnTo) {
                  router.push(returnTo as any);
                } else {
                  router.push("/");
                }
              }}
            >
              <ThemedText style={styles.skipButtonText}>
                Continue as Guest
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
