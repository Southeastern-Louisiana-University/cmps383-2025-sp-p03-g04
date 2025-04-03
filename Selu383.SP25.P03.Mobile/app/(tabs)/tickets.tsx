import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../components/AuthProvider";
import * as reservationService from "../../services/reservations/reservationService";
import { ReservationResponse } from "../../types/api/reservations";
import { ticketsScreenStyles as styles } from "../../styles/screens/ticketsScreen";

export default function TicketsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserReservations();
  }, []);

  const fetchUserReservations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("User not logged in");
      }

      const userReservations = await reservationService.getUserReservations(
        user.id
      );
      setReservations(userReservations);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError("Unable to load your tickets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleViewTicket = (reservationId: number) => {
    router.push(`./ticket/${reservationId}`);
  };

  const handleCancelReservation = async (reservationId: number) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await reservationService.cancelReservation(reservationId);
              // Remove from list
              setReservations((prevReservations) =>
                prevReservations.filter((r) => r.id !== reservationId)
              );
            } catch (err) {
              console.error("Failed to cancel reservation:", err);
              Alert.alert(
                "Error",
                "Failed to cancel your reservation. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    fetchUserReservations();
  };

  // Content to render when there are no tickets
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="ticket-outline" size={60} color="#9BA1A6" />
      <ThemedText style={styles.emptyStateTitle}>No Tickets Found</ThemedText>
      <ThemedText style={styles.emptyStateText}>
        You don't have any reservations or tickets yet.
      </ThemedText>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/(tabs)/movies")}
      >
        <ThemedText style={styles.browseButtonText}>Browse Movies</ThemedText>
      </TouchableOpacity>
    </View>
  );

  // Render individual ticket/reservation item
  const renderReservationItem = ({ item }: { item: ReservationResponse }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <ThemedText style={styles.movieTitle}>{item.movieTitle}</ThemedText>
        <View
          style={[
            styles.statusBadge,
            item.isPaid ? styles.paidBadge : styles.unpaidBadge,
          ]}
        >
          <ThemedText style={styles.statusText}>
            {item.isPaid ? "Paid" : "Unpaid"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#9BA1A6" />
          <ThemedText style={styles.detailText}>
            {formatDate(item.showtimeStartTime)}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color="#9BA1A6" />
          <ThemedText style={styles.detailText}>
            {item.theaterName} • {item.screenName}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color="#9BA1A6" />
          <ThemedText style={styles.detailText}>
            {item.tickets.length}{" "}
            {item.tickets.length === 1 ? "Ticket" : "Tickets"}
          </ThemedText>
        </View>

        <View style={styles.seatsRow}>
          <Ionicons name="grid-outline" size={16} color="#9BA1A6" />
          <ThemedText style={styles.detailText}>
            Seats: {item.tickets.map((t) => `${t.row}${t.number}`).join(", ")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <ThemedText style={styles.totalText}>
          Total: ${item.totalAmount.toFixed(2)}
        </ThemedText>

        <View style={styles.buttonsRow}>
          {!item.isPaid && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(item.id)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewTicket(item.id)}
          >
            <ThemedText style={styles.viewButtonText}>
              {item.isPaid ? "View Ticket" : "Complete Payment"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Tickets",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.refreshButton}
            >
              <Ionicons name="refresh" size={22} color="#242424" />
            </TouchableOpacity>
          ),
        }}
      />

      <ThemedView style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B4D335" />
            <ThemedText style={styles.loadingText}>
              Loading your tickets...
            </ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={50} color="#E74C3C" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={reservations}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ThemedView>
    </>
  );
}
