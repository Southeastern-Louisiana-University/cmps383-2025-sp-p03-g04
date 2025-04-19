import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";

import * as reservationService from "../../../services/reservations/reservationService";

export default function ConfirmationScreen() {
  const { id, reservationId, guest } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [reservation, setReservation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrValue, setQrValue] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if we're loading for a guest
      if (guest === "true") {
        // Find the guest ticket in AsyncStorage
        const guestTicketsStr = await AsyncStorage.getItem("guestTickets");
        if (guestTicketsStr) {
          const guestTickets = JSON.parse(guestTicketsStr);
          const foundTicket = guestTickets.find(
            (ticket: any) => ticket.reservationId === Number(reservationId)
          );

          if (foundTicket) {
            setReservation(foundTicket);

            // Generate a QR code value with reservation info
            const qrData = {
              type: "ticket",
              reservationId: foundTicket.reservationId,
              movieTitle: foundTicket.movieTitle,
              theaterName: foundTicket.theaterName,
              showtime: foundTicket.showtimeStartTime,
              seats: foundTicket.tickets
                .map((t: any) => `${t.row}${t.number}`)
                .join(","),
              isGuest: true,
            };

            setQrValue(JSON.stringify(qrData));
          }
        }
      } else {
        // Load authenticated user reservation
        const reservationData = await reservationService.getReservation(
          Number(reservationId)
        );
        setReservation(reservationData);

        // Generate a QR code value with reservation info
        const qrData = {
          type: "ticket",
          reservationId: reservationData.id,
          movieTitle: reservationData.movieTitle,
          theaterName: reservationData.theaterName,
          showtime: reservationData.showtimeStartTime,
          seats: reservationData.tickets
            .map((t: any) => `${t.row}${t.number}`)
            .join(","),
          isGuest: false,
          userId: user?.id,
        };

        setQrValue(JSON.stringify(qrData));
      }
    } catch (error) {
      console.error("Failed to load confirmation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareTicket = async () => {
    try {
      // Format the ticket information for sharing
      const message = `
      🎬 Movie Ticket: ${reservation.movieTitle}
      🏢 Theater: ${reservation.theaterName} - ${
        reservation.screenName || "Screen 1"
      }
      🕒 Showtime: ${new Date(reservation.showtimeStartTime).toLocaleString()}
      🎟️ Seats: ${reservation.tickets
        .map((t: any) => `${t.row}${t.number}`)
        .join(", ")}
      
      💡 Show this message at the entrance to access your seats
      `;

      await Share.share({
        message,
        title: "Lion's Den Cinemas - Your Movie Ticket",
      });
    } catch (error) {
      console.error("Failed to share ticket:", error);
    }
  };

  const handleGoHome = () => {
    router.push("/(tabs)");
  };

  const handleViewTickets = () => {
    router.push("/(tabs)/tickets");
  };

  // Render loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading ticket details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!reservation) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#E74C3C" />
        <ThemedText style={styles.errorText}>
          Ticket not found. Please check your bookings.
        </ThemedText>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <ThemedText style={styles.homeButtonText}>Go to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ticket Confirmation",
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#B4D335" />
            <ThemedText style={styles.successTitle}>
              Purchase Complete!
            </ThemedText>
            <ThemedText style={styles.successText}>
              Your tickets have been purchased successfully. Show the QR code
              below at the entrance.
            </ThemedText>
          </View>

          <View style={styles.ticketContainer}>
            <View style={styles.ticketHeader}>
              <ThemedText style={styles.theaterName}>
                {reservation.theaterName}
              </ThemedText>
              <ThemedText style={styles.screenName}>
                {reservation.screenName || "Screen 1"}
              </ThemedText>
            </View>

            <View style={styles.ticketBody}>
              <ThemedText style={styles.movieTitle}>
                {reservation.movieTitle}
              </ThemedText>

              <ThemedText style={styles.showtime}>
                {new Date(reservation.showtimeStartTime).toLocaleString(
                  undefined,
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </ThemedText>

              <View style={styles.seatsContainer}>
                <ThemedText style={styles.seatsLabel}>Seats:</ThemedText>
                <ThemedText style={styles.seatsValue}>
                  {reservation.tickets
                    .map((t: any) => `${t.row}${t.number}`)
                    .join(", ")}
                </ThemedText>
              </View>

              {/* Add this after the seatsContainer view in the ticketBody */}
              {reservation &&
                reservation.foodItems &&
                reservation.foodItems.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.foodContainer}>
                      <ThemedText style={styles.foodLabel}>
                        Food Order:
                      </ThemedText>
                      {reservation.foodItems.map((item: any, index: number) => (
                        <ThemedText key={index} style={styles.foodItem}>
                          {item.quantity}x{" "}
                          {item.foodItemName || `Item #${item.foodItemId}`}
                        </ThemedText>
                      ))}
                      <ThemedText style={styles.deliveryType}>
                        {reservation.foodDeliveryType === "ToSeat"
                          ? "Delivery to your seat"
                          : "Pickup at concession counter"}
                      </ThemedText>
                    </View>
                  </>
                )}

              <View style={styles.divider} />

              <View style={styles.qrContainer}>
                {qrValue ? (
                  <QRCode
                    value={qrValue}
                    size={200}
                    color="#000000"
                    backgroundColor="white"
                  />
                ) : (
                  <ActivityIndicator size="large" color="#B4D335" />
                )}
              </View>

              <ThemedText style={styles.scanText}>
                Scan this QR code at the entrance
              </ThemedText>

              <ThemedText style={styles.transactionId}>
                Transaction ID: {reservation.id || reservation.reservationId}
              </ThemedText>
            </View>

            <View style={styles.ticketFooter}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareTicket}
              >
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <ThemedText style={styles.shareButtonText}>
                  Share Ticket
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewTicketsButton}
              onPress={handleViewTickets}
            >
              <ThemedText style={styles.viewTicketsText}>
                View All Tickets
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
              <ThemedText style={styles.homeButtonText}>
                Back to Home
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Theme toggle */}
        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  foodContainer: {
    width: "100%",
    marginVertical: 16,
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodItem: {
    fontSize: 14,
    marginBottom: 6,
    paddingLeft: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#B4D335",
    marginTop: 8,
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#9BA1A6",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    color: "#9BA1A6",
  },
  ticketContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#262D33",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  ticketHeader: {
    backgroundColor: "#B4D335",
    padding: 16,
    alignItems: "center",
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E2429",
  },
  screenName: {
    fontSize: 14,
    color: "#1E2429",
  },
  ticketBody: {
    padding: 20,
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  showtime: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 16,
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  seatsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  seatsValue: {
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    height: 220,
    width: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  scanText: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 16,
  },
  transactionId: {
    fontSize: 12,
    color: "#666666",
  },
  ticketFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A7EA4",
    padding: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  actionButtons: {
    width: "100%",
  },
  viewTicketsButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  viewTicketsText: {
    color: "#B4D335",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
});
