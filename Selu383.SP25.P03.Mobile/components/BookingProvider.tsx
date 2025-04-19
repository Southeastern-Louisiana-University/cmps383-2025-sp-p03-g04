import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as reservationService from "../services/reservations/reservationService";
import { Showtime } from "../types/models/movie";
import { CreateTicketRequest } from "../types/api/reservations";

interface BookingContextType {
  // Booking state
  showtimeId: number | null;
  showtime: Showtime | null;
  selectedSeats: number[];
  ticketTypes: Record<number, string>;
  reservationId: number | null;
  foodItems: any[];
  foodDeliveryType: string;
  totalAmount: number;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Methods
  setShowtimeInfo: (id: number, showtime: Showtime) => void;
  toggleSeatSelection: (seatId: number) => void;
  setTicketType: (seatId: number, type: string) => void;
  calculateTotal: () => number;
  createReservation: () => Promise<number | null>;
  addFoodItem: (foodItem: any, quantity: number) => void;
  removeFoodItem: (foodItemId: number) => void;
  setFoodDeliveryType: (type: string) => void;
  resetBooking: () => void;
  saveBookingProgress: () => Promise<void>;
  loadBookingProgress: () => Promise<boolean>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  // Basic booking state
  const [showtimeId, setShowtimeId] = useState<number | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<number, string>>({});
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [foodDeliveryType, setFoodDeliveryType] = useState<string>("Pickup");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update total amount when selections change
  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [selectedSeats, ticketTypes, foodItems, showtime]);

  const setShowtimeInfo = (id: number, showtimeData: Showtime) => {
    setShowtimeId(id);
    setShowtime(showtimeData);
  };

  const toggleSeatSelection = (seatId: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Remove seat and ticket type
        const newTicketTypes = { ...ticketTypes };
        delete newTicketTypes[seatId];
        setTicketTypes(newTicketTypes);

        return prev.filter((id) => id !== seatId);
      } else {
        // Add seat with Adult as default type
        setTicketTypes({ ...ticketTypes, [seatId]: "Adult" });
        return [...prev, seatId];
      }
    });
  };

  const setTicketType = (seatId: number, type: string) => {
    setTicketTypes((prev) => ({ ...prev, [seatId]: type }));
  };

  const calculateTotal = () => {
    let total = 0;

    // Calculate ticket prices
    if (showtime && selectedSeats.length > 0) {
      const basePrice = showtime.ticketPrice;

      total += selectedSeats.reduce((sum, seatId) => {
        const ticketType = ticketTypes[seatId] || "Adult";

        // Apply discount based on ticket type
        switch (ticketType) {
          case "Child":
            return sum + basePrice * 0.75; // 25% off for children
          case "Senior":
            return sum + basePrice * 0.8; // 20% off for seniors
          default:
            return sum + basePrice; // Full price for adults
        }
      }, 0);
    }

    // Add food items
    total += foodItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return total;
  };

  const createReservation = async (): Promise<number | null> => {
    if (!showtimeId || selectedSeats.length === 0) {
      setError("Please select seats before creating a reservation");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tickets: CreateTicketRequest[] = selectedSeats.map((seatId) => ({
        seatId,
        ticketType: ticketTypes[seatId] || "Adult",
      }));

      const reservationRequest = {
        showtimeId,
        tickets,
        processPayment: false,
      };

      const reservation = await reservationService.createReservation(
        reservationRequest
      );
      setReservationId(reservation.id);

      return reservation.id;
    } catch (error) {
      console.error("Error creating reservation:", error);
      setError("Failed to create reservation. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodItem = (foodItem: any, quantity: number) => {
    setFoodItems((prev) => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(
        (item) => item.foodItemId === foodItem.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [
          ...prev,
          {
            foodItemId: foodItem.id,
            foodItemName: foodItem.name,
            price: foodItem.price,
            quantity,
          },
        ];
      }
    });
  };

  const removeFoodItem = (foodItemId: number) => {
    setFoodItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.foodItemId === foodItemId
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        if (newItems[existingItemIndex].quantity > 1) {
          // Decrease quantity if more than 1
          newItems[existingItemIndex].quantity -= 1;
          return newItems;
        } else {
          // Remove item if quantity would be 0
          return prev.filter((item) => item.foodItemId !== foodItemId);
        }
      }

      return prev;
    });
  };

  const saveBookingProgress = async (): Promise<void> => {
    try {
      const bookingData = JSON.stringify({
        showtimeId,
        selectedSeats,
        ticketTypes,
        reservationId,
        foodItems,
        foodDeliveryType,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem("bookingProgress", bookingData);
    } catch (error) {
      console.error("Error saving booking progress:", error);
    }
  };

  const loadBookingProgress = async (): Promise<boolean> => {
    try {
      const bookingData = await AsyncStorage.getItem("bookingProgress");

      if (bookingData) {
        const parsed = JSON.parse(bookingData);

        // Check if the data is still valid (e.g., not older than 30 minutes)
        const timestamp = new Date(parsed.timestamp);
        const now = new Date();
        const timeDiffMinutes =
          (now.getTime() - timestamp.getTime()) / (1000 * 60);

        if (timeDiffMinutes <= 30) {
          setShowtimeId(parsed.showtimeId);
          setSelectedSeats(parsed.selectedSeats);
          setTicketTypes(parsed.ticketTypes);
          setReservationId(parsed.reservationId);
          setFoodItems(parsed.foodItems || []);
          setFoodDeliveryType(parsed.foodDeliveryType || "Pickup");

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error loading booking progress:", error);
      return false;
    }
  };

  const resetBooking = () => {
    setShowtimeId(null);
    setShowtime(null);
    setSelectedSeats([]);
    setTicketTypes({});
    setReservationId(null);
    setFoodItems([]);
    setFoodDeliveryType("Pickup");
    setTotalAmount(0);
    setError(null);

    // Clear saved progress
    AsyncStorage.removeItem("bookingProgress");
  };

  return (
    <BookingContext.Provider
      value={{
        showtimeId,
        showtime,
        selectedSeats,
        ticketTypes,
        reservationId,
        foodItems,
        foodDeliveryType,
        totalAmount,
        isLoading,
        error,
        setShowtimeInfo,
        toggleSeatSelection,
        setTicketType,
        calculateTotal,
        createReservation,
        addFoodItem,
        removeFoodItem,
        setFoodDeliveryType,
        resetBooking,
        saveBookingProgress,
        loadBookingProgress,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
