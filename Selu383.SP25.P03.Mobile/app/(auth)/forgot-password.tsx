import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { forgotPasswordStyles as styles } from "../../styles/screens/forgotPasswordScreen";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reset Password",
          headerStyle: {
            backgroundColor: "#B4D335",
          },
          headerTintColor: "#242424",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ThemedView style={styles.container}>
          {submitted ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#B4D335" />
              <ThemedText style={styles.successTitle}>
                Check Your Email
              </ThemedText>
              <ThemedText style={styles.successMessage}>
                We've sent password reset instructions to your email address.
                Please check your inbox.
              </ThemedText>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => router.back()}
              >
                <ThemedText style={styles.backToLoginText}>
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Ionicons
                name="lock-open"
                size={60}
                color="#B4D335"
                style={styles.icon}
              />
              <ThemedText style={styles.title}>
                Forgot Your Password?
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your email address and we'll send you instructions to
                reset your password.
              </ThemedText>

              {error ? (
                <View style={styles.errorContainer}>
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9BA1A6"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9BA1A6"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <ThemedText style={styles.submitButtonText}>
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ThemedText style={styles.backButtonText}>
                  Back to Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}
