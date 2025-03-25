import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';

type UserRole = 'customer' | 'staff' | 'manager';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleNext = async () => {
    if (selectedRole) {
      // Store the selected role
      await AsyncStorage.setItem('selectedRole', selectedRole);
      // Navigate to login
      router.push('/login');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome</ThemedText>
        <ThemedText style={styles.instruction}>Please select your role to continue</ThemedText>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'customer' && styles.selectedRole
          ]}
          onPress={() => handleRoleSelect('customer')}
        >
          <Ionicons
            name="person"
            size={24}
            color={selectedRole === 'customer' ? 'white' : '#B4D335'}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === 'customer' && styles.selectedRoleText
              ]}
            >
              Customer
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === 'customer' && styles.selectedRoleText
              ]}
            >
              Book tickets & manage reservations
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === 'customer' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'staff' && styles.selectedRole
          ]}
          onPress={() => handleRoleSelect('staff')}
        >
          <Ionicons
            name="ticket"
            size={24}
            color={selectedRole === 'staff' ? 'white' : '#0A7EA4'}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === 'staff' && styles.selectedRoleText
              ]}
            >
              Staff
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === 'staff' && styles.selectedRoleText
              ]}
            >
              Ticket validation & service
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === 'staff' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'manager' && styles.selectedRole
          ]}
          onPress={() => handleRoleSelect('manager')}
        >
          <Ionicons
            name="analytics"
            size={24}
            color={selectedRole === 'manager' ? 'white' : '#C87000'}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === 'manager' && styles.selectedRoleText
              ]}
            >
              Manager
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === 'manager' && styles.selectedRoleText
              ]}
            >
              Administration & analytics
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === 'manager' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !selectedRole && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedRole}
      >
        <ThemedText style={styles.nextButtonText}>Next</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.footer}>
        © 2025 Lion's Den Cinemas. All rights reserved.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    color: '#9BA1A6',
  },
  rolesContainer: {
    width: '100%',
    marginVertical: 32,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#1E2429',
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedRole: {
    backgroundColor: '#B4D335',
    borderColor: '#B4D335',
  },
  roleTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  roleDescription: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  selectedRoleText: {
    color: 'white',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B4D335',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#B4D335',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#4A4A4A',
  },
  nextButtonText: {
    color: '#242424',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 12,
    color: '#9BA1A6',
  },
});