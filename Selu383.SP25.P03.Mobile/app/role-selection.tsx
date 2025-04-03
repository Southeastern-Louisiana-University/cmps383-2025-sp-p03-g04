import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { UserRole } from "../types/models/user";
import { roleSelectionStyles as styles } from "../styles/screens/roleSelectionScreen";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleNext = async () => {
    if (selectedRole) {
      // Store the selected role
      await AsyncStorage.setItem("selectedRole", selectedRole);
      // Navigate to login
      router.push("/login");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome</ThemedText>
        <ThemedText style={styles.instruction}>
          Please select your role to continue
        </ThemedText>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === "customer" && styles.selectedRole,
          ]}
          onPress={() => handleRoleSelect("customer")}
        >
          <Ionicons
            name="person"
            size={24}
            color={selectedRole === "customer" ? "white" : "#B4D335"}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === "customer" && styles.selectedRoleText,
              ]}
            >
              Customer
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === "customer" && styles.selectedRoleText,
              ]}
            >
              Book tickets & manage reservations
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === "customer" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === "staff" && styles.selectedRole,
          ]}
          onPress={() => handleRoleSelect("staff")}
        >
          <Ionicons
            name="ticket"
            size={24}
            color={selectedRole === "staff" ? "white" : "#0A7EA4"}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === "staff" && styles.selectedRoleText,
              ]}
            >
              Staff
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === "staff" && styles.selectedRoleText,
              ]}
            >
              Ticket validation & service
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === "staff" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === "manager" && styles.selectedRole,
          ]}
          onPress={() => handleRoleSelect("manager")}
        >
          <Ionicons
            name="analytics"
            size={24}
            color={selectedRole === "manager" ? "white" : "#C87000"}
          />
          <View style={styles.roleTextContainer}>
            <ThemedText
              style={[
                styles.roleTitle,
                selectedRole === "manager" && styles.selectedRoleText,
              ]}
            >
              Manager
            </ThemedText>
            <ThemedText
              style={[
                styles.roleDescription,
                selectedRole === "manager" && styles.selectedRoleText,
              ]}
            >
              Administration & analytics
            </ThemedText>
          </View>
          <View style={styles.radioButton}>
            {selectedRole === "manager" && <View style={styles.radioInner} />}
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
