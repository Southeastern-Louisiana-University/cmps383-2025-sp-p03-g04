import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useTheme } from "../../../components/ThemeProvider";

export default function FoodOptionScreen() {
  const { id, reservationId } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const handleSkipFood = () => {
    // Skip food and go directly to payment
    router.push({
      pathname: `./booking/${id}/payment`,
      params: { reservationId: reservationId as string },
    });
  };

  const handleOrderFood = (deliveryType: "Pickup" | "ToSeat") => {
    // Go to concessions screen with delivery option
    router.push({
      pathname: `./booking/${id}/concessions`,
      params: {
        reservationId: reservationId as string,
        deliveryType,
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Food Options",
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
            Would you like to order food?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Order now and have it ready when you arrive or delivered to your
            seat
          </ThemedText>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOrderFood("ToSeat")}
            >
              <Ionicons name="person" size={30} color="#B4D335" />
              <ThemedText style={styles.optionText}>Deliver to Seat</ThemedText>
              <ThemedText style={styles.optionDescription}>
                Have your food delivered directly to your seat during the movie
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOrderFood("Pickup")}
            >
              <Ionicons name="restaurant" size={30} color="#B4D335" />
              <ThemedText style={styles.optionText}>
                Pickup at Counter
              </ThemedText>
              <ThemedText style={styles.optionDescription}>
                Skip the line and have your order ready when you arrive
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipFood}
            >
              <ThemedText style={styles.skipText}>
                No Thanks, Skip to Payment
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
  skipButton: {
    marginTop: 24,
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: "#9BA1A6",
    textAlign: "center",
  },
});
