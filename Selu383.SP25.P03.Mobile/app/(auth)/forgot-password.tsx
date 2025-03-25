import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Simple validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // In a real app, this would call an API to send a reset email
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reset Password',
          headerStyle: {
            backgroundColor: '#B4D335',
          },
          headerTintColor: '#242424',
        }}
      />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ThemedView style={styles.container}>
          {submitted ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#B4D335" />
              <ThemedText style={styles.successTitle}>Check Your Email</ThemedText>
              <ThemedText style={styles.successMessage}>
                We've sent password reset instructions to your email address. Please check your inbox.
              </ThemedText>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => router.back()}
              >
                <ThemedText style={styles.backToLoginText}>Back to Login</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Ionicons name="lock-open" size={60} color="#B4D335" style={styles.icon} />
              <ThemedText style={styles.title}>Forgot Your Password?</ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your email address and we'll send you instructions to reset your password.
              </ThemedText>

              {error ? (
                <View style={styles.errorContainer}>
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
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
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ThemedText style={styles.backButtonText}>Back to Login</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#1E2429',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9BA1A6',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    height: 50,
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    color: 'white',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#B4D335',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#242424',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#9BA1A6',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#9BA1A6',
    textAlign: 'center',
    marginBottom: 30,
  },
  backToLoginButton: {
    backgroundColor: '#B4D335',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToLoginText: {
    color: '#242424',
    fontSize: 16,
    fontWeight: 'bold',
  },
});