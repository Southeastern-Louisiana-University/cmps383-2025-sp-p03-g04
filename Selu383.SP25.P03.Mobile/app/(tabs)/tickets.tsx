import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useBooking } from "../../components/BookingProvider";
import * as reservationService from "../../services/reservations/reservationService";
import { ReservationResponse } from "../../types/api/reservations";

export default function TicketsScreen() {
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const booking = useBooking();

  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [guestTickets, setGuestTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, [isAuthenticated]);

  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && user) {
        const userReservations = await reservationService.getUserReservations(
          user.id
        );
        setReservations(userReservations);

        await AsyncStorage.removeItem("guestTickets");
        setGuestTickets([]);
      } else {
        setReservations([]);
        setGuestTickets([]);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
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

  const handleViewTicket = (ticketId: number, isGuest: boolean = false) => {
    router.push({
      pathname: `./booking/${isGuest ? "guest" : ticketId}/confirmation`,
      params: {
        reservationId: ticketId.toString(),
        guest: isGuest ? "true" : "false",
      },
    });
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
    loadTickets();
  };

  const handleLogin = () => {
    router.push("/login?returnTo=/tickets");
  };

  if (!isAuthenticated && guestTickets.length === 0 && !isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "My Tickets" }} />
        <View style={styles.emptyStateContainer}>
          <Ionicons name="ticket-outline" size={60} color="#9BA1A6" />
          <ThemedText style={styles.emptyStateTitle}>
            Sign in to view your tickets
          </ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Create an account or sign in to save and view your tickets in one
            place.
          </ThemedText>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    );
  }

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

  const renderGuestTicketItem = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <ThemedText style={styles.movieTitle}>{item.movieTitle}</ThemedText>
        <View style={[styles.statusBadge, styles.paidBadge]}>
          <ThemedText style={styles.statusText}>Paid</ThemedText>
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
            Seats:{" "}
            {item.tickets
              .map(
                (t: { row: string; number: number }) => `${t.row}${t.number}`
              )
              .join(", ")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.ticketFooter}>
        <ThemedText style={styles.totalText}>
          Total: ${item.totalAmount.toFixed(2)}
        </ThemedText>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewTicket(item.reservationId, true)}
          >
            <ThemedText style={styles.viewButtonText}>View Ticket</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const allTickets = [
    ...reservations.map((item) => ({ ...item, isGuest: false })),
    ...guestTickets.map((item) => ({ ...item, isGuest: true })),
  ];

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
              <Ionicons name="refresh" size={22} color="#B4D335" />
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
            data={allTickets}
            renderItem={({ item }) =>
              item.isGuest
                ? renderGuestTicketItem({ item })
                : renderReservationItem({ item })
            }
            keyExtractor={(item) =>
              `${item.id || item.reservationId}-${
                item.isGuest ? "guest" : "user"
              }`
            }
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}

        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  refreshButton: {
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9BA1A6",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#E74C3C",
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#242424",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
    minHeight: "100%",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "white",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#9BA1A6",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#1E2429",
    fontWeight: "bold",
    fontSize: 16,
  },
  browseButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 16,
  },
  ticketCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  paidBadge: {
    backgroundColor: "rgba(76, 217, 100, 0.2)",
  },
  unpaidBadge: {
    backgroundColor: "rgba(255, 204, 0, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  ticketDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailText: {
    fontSize: 14,
    color: "#9BA1A6",
    marginLeft: 8,
    flex: 1,
  },
  ticketFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E74C3C",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#E74C3C",
    fontWeight: "500",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#B4D335",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#242424",
    fontWeight: "bold",
  },
});
