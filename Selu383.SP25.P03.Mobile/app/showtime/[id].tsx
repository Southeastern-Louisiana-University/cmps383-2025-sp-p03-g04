// File: app/showtime/[id].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";

import * as movieService from "../../services/movies/movieService";
import { Showtime } from "../../types/models/movie";

export default function ShowtimeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load showtime details
        const showtimeData = await movieService.getShowtime(Number(id));
        setShowtime(showtimeData);
      } catch (error) {
        console.error("Error loading showtime data:", error);
        Alert.alert("Error", "Failed to load showtime information");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleBookTickets = () => {
    // Navigate to booking flow without requiring authentication
    router.push(`/booking/${id}/seats`);
  };

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={{ marginTop: 16 }}>
          Loading showtime details...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Showtime Details",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTintColor: "#B4D335",
        }}
      />

      <ThemedView style={{ flex: 1 }}>
        <ScrollView style={{ padding: 16 }}>
          {/* Movie and Showtime Info */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginBottom: 8,
              }}
            >
              {showtime?.movieTitle}
            </ThemedText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color="#B4D335"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={{ color: "#B4D335", fontSize: 16 }}>
                {new Date(showtime?.startTime || "").toLocaleString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Ionicons
                name="business-outline"
                size={18}
                color="#9BA1A6"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={{ color: "#9BA1A6", fontSize: 16 }}>
                {showtime?.theaterName} • {showtime?.screenName}
              </ThemedText>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="cash-outline"
                size={18}
                color="#9BA1A6"
                style={{ marginRight: 8 }}
              />
              <ThemedText style={{ color: "#9BA1A6", fontSize: 16 }}>
                Ticket price: ${showtime?.ticketPrice.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          {/* Book Tickets Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#B4D335",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={handleBookTickets}
          >
            <ThemedText
              style={{ color: "#1E2429", fontSize: 16, fontWeight: "bold" }}
            >
              Book Tickets
            </ThemedText>
          </TouchableOpacity>

          {/* View Theater Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#1E3A55",
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => router.push(`/theater/${showtime?.theaterId}`)}
          >
            <ThemedText
              style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            >
              View Theater Details
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}
