import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../components/AuthProvider";

export default function DeliveryOptionScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = colorScheme === "dark";

  // Parse cart items from params
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (params.cartItems) {
      try {
        const items = JSON.parse(params.cartItems as string);
        setCartItems(items);
      } catch (error) {
        console.error("Error parsing cart items:", error);
        Alert.alert(
          "Error",
          "Could not load your cart items. Please try again."
        );
        router.back();
      }
    }
  }, [params.cartItems]);

  const handleDeliveryOption = async (deliveryType: "Pickup" | "ToSeat") => {
    // Save cart and delivery option to AsyncStorage
    try {
      await AsyncStorage.setItem("foodCart", JSON.stringify(cartItems));
      await AsyncStorage.setItem("foodDeliveryType", deliveryType);

      // If user wants delivery to seat but isn't authenticated, prompt login
      if (deliveryType === "ToSeat" && !isAuthenticated) {
        Alert.alert(
          "Authentication Required",
          "You need to sign in to have food delivered to your seat.",
          [
            {
              text: "Sign In",
              onPress: () => {
                router.push("/login?returnTo=/food-checkout/payment");
              },
            },
            {
              text: "Continue as Guest",
              onPress: () => {
                // For guest, default to pickup
                router.push("../food-checkout/payment");
              },
            },
          ]
        );
      } else {
        // Otherwise proceed to payment
        router.push("../food-checkout/payment");
      }
    } catch (error) {
      console.error("Error saving cart data:", error);
      Alert.alert(
        "Error",
        "Could not save your order preferences. Please try again."
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Delivery Options",
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#242424",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#242424",
        }}
      />

      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="fast-food" size={80} color="#B4D335" />
          </View>

          <ThemedText style={styles.title}>
            How would you like to get your food?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Select a delivery option for your order
          </ThemedText>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleDeliveryOption("Pickup")}
            >
              <Ionicons name="restaurant-outline" size={30} color="#B4D335" />
              <ThemedText style={styles.optionText}>
                Pickup at Counter
              </ThemedText>
              <ThemedText style={styles.optionDescription}>
                Skip the line and have your order ready when you arrive
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleDeliveryOption("ToSeat")}
            >
              <Ionicons name="person-outline" size={30} color="#B4D335" />
              <ThemedText style={styles.optionText}>Deliver to Seat</ThemedText>
              <ThemedText style={styles.optionDescription}>
                Have your food delivered directly to your seat during the movie
              </ThemedText>
              {!isAuthenticated && (
                <ThemedText style={styles.requiresSignIn}>
                  (Requires sign in)
                </ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.backText}>
                Back to Food Selection
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 36,
    color: "#9BA1A6",
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#9BA1A6",
  },
  requiresSignIn: {
    fontSize: 12,
    color: "#B4D335",
    marginTop: 8,
    fontStyle: "italic",
  },
  backButton: {
    marginTop: 24,
    padding: 16,
  },
  backText: {
    fontSize: 16,
    color: "#9BA1A6",
    textAlign: "center",
  },
});
