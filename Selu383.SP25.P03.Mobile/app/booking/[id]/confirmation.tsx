import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";

import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { QRCode } from "../../../components/QRCode";

import * as reservationService from "../../../services/reservations/reservationService";

import { ReservationResponse } from "../../../types/api/reservations";
import { confirmationScreenStyles as styles } from "../../../styles/screens/confirmationScreen";

export default function ConfirmationScreen() {
  const { id, reservationId, guest } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode, isTheaterMode } = useTheme();

  // State variables
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [guestTicket, setGuestTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
    loadData();
    generateConfirmationCode();
  }, [reservationId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (reservationId) {
        // For authenticated users or after creating a guest reservation
        const reservationData = await reservationService.getReservation(
          Number(reservationId)
        );
        setReservation(reservationData);

        // For guest users, we also need to check local storage
        if (guest === "true") {
          const guestTicketsStr = await AsyncStorage.getItem("guestTickets");
          if (guestTicketsStr) {
            const guestTickets = JSON.parse(guestTicketsStr);
            const ticket = guestTickets.find(
              (t: any) => t.reservationId === Number(reservationId)
            );
            if (ticket) {
              setGuestTicket(ticket);
            }
          }
        }
      } else {
        // No reservation ID provided
        Alert.alert("Error", "No booking information found.", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load reservation data:", error);
      Alert.alert(
        "Error",
        "Failed to load ticket information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a random confirmation code
  const generateConfirmationCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setConfirmationCode(code);
  };

  // Create QR code data
  const getQRCodeData = () => {
    const data = {
      reservationId: reservation?.id || Number(reservationId),
      movieTitle: reservation?.movieTitle || guestTicket?.movieTitle,
      theaterName: reservation?.theaterName || guestTicket?.theaterName,
      screenName: reservation?.screenName || guestTicket?.screenName,
      showtimeStartTime:
        reservation?.showtimeStartTime || guestTicket?.showtimeStartTime,
      tickets: reservation?.tickets || guestTicket?.tickets,
      confirmationCode,
      isGuest: guest === "true",
    };

    return JSON.stringify(data);
  };

  // Share ticket
  const handleShareTicket = async () => {
    try {
      const movieTitle = reservation?.movieTitle || guestTicket?.movieTitle;
      const theaterName = reservation?.theaterName || guestTicket?.theaterName;
      const date = new Date(
        reservation?.showtimeStartTime || guestTicket?.showtimeStartTime
      ).toLocaleDateString();
      const time = new Date(
        reservation?.showtimeStartTime || guestTicket?.showtimeStartTime
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const shareMessage = `I'm going to see ${movieTitle} at ${theaterName} on ${date} at ${time}. My confirmation code is ${confirmationCode}. See you there!`;

      await Share.share({
        message: shareMessage,
        title: "My Movie Ticket",
      });
    } catch (error) {
      console.error("Error sharing ticket:", error);
    }
  };

  // Add to wallet
  const handleAddToWallet = () => {
    // This would integrate with Apple Wallet/Google Pay in a real app
    Alert.alert(
      "Add to Wallet",
      "This feature would add your ticket to Apple Wallet or Google Pay in a real app.",
      [
        {
          text: "OK",
        },
      ]
    );
  };

  // Navigate to home
  const handleDone = () => {
    router.push("/(tabs)");
  };

  // Navigate to food ordering
  const handleOrderFood = () => {
    router.push("/(tabs)/concessions");
  };

  // Render loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading your ticket...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Booking Confirmed",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTitleStyle: {
            color: "#FFFFFF",
          },
          headerTintColor: "#B4D335",
          // Disable back button
          headerBackVisible: false,
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Success message */}
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#B4D335" />
            <ThemedText style={styles.successTitle}>
              Booking Confirmed!
            </ThemedText>
            <ThemedText style={styles.successMessage}>
              Your ticket has been booked successfully. Please show this screen
              when entering the theater.
            </ThemedText>
          </View>

          {/* Ticket */}
          <View style={styles.ticketContainer}>
            <View style={styles.ticketHeader}>
              <View style={styles.theaterInfo}>
                <ThemedText style={styles.theaterName}>
                  {reservation?.theaterName || guestTicket?.theaterName}
                </ThemedText>
                <ThemedText style={styles.screenName}>
                  {reservation?.screenName || guestTicket?.screenName}
                </ThemedText>
              </View>

              <View style={styles.logoContainer}>
                <Ionicons name="film-outline" size={24} color="#B4D335" />
              </View>
            </View>

            <View style={styles.ticketBody}>
              <ThemedText style={styles.movieTitle}>
                {reservation?.movieTitle || guestTicket?.movieTitle}
              </ThemedText>

              <ThemedText style={styles.showtimeDate}>
                {new Date(
                  reservation?.showtimeStartTime ||
                    guestTicket?.showtimeStartTime
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </ThemedText>

              <ThemedText style={styles.showtimeTime}>
                {new Date(
                  reservation?.showtimeStartTime ||
                    guestTicket?.showtimeStartTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>

              <View style={styles.ticketsInfo}>
                <ThemedText style={styles.ticketsLabel}>Tickets:</ThemedText>
                <View style={styles.ticketsList}>
                  {(reservation?.tickets || guestTicket?.tickets)?.map(
                    (ticket: any, index: number) => (
                      <ThemedText key={index} style={styles.ticketItem}>
                        {ticket.ticketType} - Seat {ticket.row}
                        {ticket.number}
                      </ThemedText>
                    )
                  )}
                </View>
              </View>

              <View style={styles.confirmationContainer}>
                <ThemedText style={styles.confirmationLabel}>
                  Confirmation Code:
                </ThemedText>
                <ThemedText style={styles.confirmationCode}>
                  {confirmationCode}
                </ThemedText>
              </View>

              <View style={styles.qrContainer}>
                <QRCode
                  value={getQRCodeData()}
                  size={180}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                />
              </View>
            </View>

            <View style={styles.ticketFooter}>
              <ThemedText style={styles.ticketFooterText}>
                Present this QR code or confirmation code at the theater
                entrance
              </ThemedText>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareTicket}
            >
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>Share</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddToWallet}
            >
              <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
              <ThemedText style={styles.actionButtonText}>
                Add to Wallet
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Order food button */}
          <TouchableOpacity style={styles.foodButton} onPress={handleOrderFood}>
            <Ionicons name="fast-food-outline" size={24} color="#1E2429" />
            <ThemedText style={styles.foodButtonText}>Order Food</ThemedText>
          </TouchableOpacity>

          {/* Done button */}
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <ThemedText style={styles.doneButtonText}>Done</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}
