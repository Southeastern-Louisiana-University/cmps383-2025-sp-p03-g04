import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { useAuth } from '../components/AuthProvider';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Get selected role from storage
  useEffect(() => {
    const getRole = async () => {
      try {
        const role = await AsyncStorage.getItem('selectedRole');
        setSelectedRole(role);
        
        // If no role is selected, go back to role selection
        if (!role) {
          router.replace('../role-selection');
        }
      } catch (error) {
        console.error('Error getting role:', error);
      }
    };
    
    getRole();
  }, []);

  // Set background and accent colors based on role
  const getRoleColors = () => {
    switch (selectedRole) {
      case 'staff':
        return {
          primary: '#0A7EA4',
          secondary: '#0A7EA4',
          background: '#1E2429',
          headerBg: '#0A7EA4'
        };
      case 'manager':
        return {
          primary: '#C87000',
          secondary: '#C87000',
          background: '#1E2429',
          headerBg: '#C87000'
        };
      case 'customer':
      default:
        return {
          primary: '#B4D335',
          secondary: '#B4D335',
          background: '#1E2429',
          headerBg: '#B4D335'
        };
    }
  };

  const { primary, background } = getRoleColors();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(username, password);
      
      // Navigate to home
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push('/register');
  };

  const navigateToForgotPassword = () => {
    router.push('../forgot-password');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
            <ThemedText style={styles.portalText}>
              {selectedRole === 'customer' ? 'Customer Portal' : selectedRole === 'staff' ? 'Staff Portal' : 'Manager Portal'}
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
                <Ionicons name="person-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={20} color="#9BA1A6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9BA1A6"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.visibilityIcon}>
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
                <View style={[styles.checkbox, rememberMe && { backgroundColor: primary, borderColor: primary }]}>
                  {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <ThemedText style={styles.rememberText}>Remember me</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <ThemedText style={[styles.forgotText, { color: primary }]}>Forgot Password?</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText style={styles.loginButtonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <ThemedText style={styles.signupText}>Don't have an account?</ThemedText>
              <TouchableOpacity onPress={navigateToSignUp}>
                <ThemedText style={[styles.signupLink, { color: primary }]}>Sign Up</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  portalText: {
    fontSize: 18,
    color: '#9BA1A6',
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
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
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
  visibilityIcon: {
    padding: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9BA1A6',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#242424',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#9BA1A6',
    fontSize: 14,
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});