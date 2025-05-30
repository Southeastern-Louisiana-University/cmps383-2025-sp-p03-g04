import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SeatingLayout } from "../types/booking";
import { ReservationDto } from "../types/Reservation";
import * as reservationService from "../services/reservationService";
import * as seatService from "../services/seatService";

interface BookingContextType {
  // State
  showtimeId: number | null;
  selectedSeats: number[];
  ticketTypes: Record<number, string>;
  reservationId: number | null;
  reservation: ReservationDto | null;
  foodItems: any[];
  foodDeliveryType: "Pickup" | "ToSeat";
  totalAmount: number;
  seatingLayout: SeatingLayout | null;
  paymentMethod: string;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;

  loadShowtime: (id: number) => Promise<void>;
  loadSeatingLayout: (showtimeId: number, userId?: number) => Promise<void>;
  loadReservation: (id: number) => Promise<void>;
  toggleSeatSelection: (seatId: number) => void;
  setTicketType: (seatId: number, type: string) => void;
  calculateTotal: () => number;
  createReservation: () => Promise<number | null>;
  processPayment: () => Promise<boolean>;
  addFoodItem: (foodItem: any, quantity: number) => void;
  removeFoodItem: (foodItemId: number) => void;
  setFoodDeliveryType: (type: "Pickup" | "ToSeat") => void;
  setPaymentMethod: (method: string) => void;
  setIsGuest: (isGuest: boolean) => void;
  resetBooking: () => void;
  saveBookingProgress: () => void;
  loadBookingProgress: () => boolean;
  completeGuestBooking: (
    showtimeId: number
  ) => Promise<{ reservationId: number }>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showtimeId, setShowtimeId] = useState<number | null>(null);
  const [showtime, setShowtime] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<number, string>>({});
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [reservation, setReservation] = useState<ReservationDto | null>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [foodDeliveryType, setFoodDeliveryType] = useState<"Pickup" | "ToSeat">(
    "Pickup"
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("visa");
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [selectedSeats, ticketTypes, foodItems, showtime]);

  const loadShowtime = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const showtimeData = await fetch(`/api/showtimes/${id}`).then((res) =>
        res.json()
      );
      setShowtimeId(id);
      setShowtime(showtimeData);
    } catch (error) {
      console.error("Error loading showtime:", error);
      setError("Failed to load showtime information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeatingLayout = async (showtimeId: number, userId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const layout = await seatService.getSeatsForShowtime(showtimeId, userId);
      setSeatingLayout(layout);
    } catch (error) {
      console.error("Error loading seating layout:", error);
      setError("Failed to load seating layout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReservation = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const reservationData = await reservationService.getReservation(id);
      setReservationId(id);
      setReservation(reservationData);
    } catch (error) {
      console.error("Error loading reservation:", error);
      setError("Failed to load reservation information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeatSelection = (seatId: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        const newTicketTypes = { ...ticketTypes };
        delete newTicketTypes[seatId];
        setTicketTypes(newTicketTypes);

        return prev.filter((id) => id !== seatId);
      } else {
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

    if (showtime && selectedSeats.length > 0) {
      const basePrice = showtime.ticketPrice;

      total += selectedSeats.reduce((sum, seatId) => {
        const ticketType = ticketTypes[seatId] || "Adult";

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
      const tickets = selectedSeats.map((seatId) => ({
        seatId,
        ticketType: ticketTypes[seatId] || "Adult",
      }));

      const reservationRequest = {
        showtimeId,
        tickets,
        processPayment: false,
      };

      const reservationResponse = await reservationService.createReservation(
        reservationRequest
      );
      setReservationId(reservationResponse.id);
      setReservation(reservationResponse);

      return reservationResponse.id;
    } catch (error) {
      console.error("Error creating reservation:", error);
      setError("Failed to create reservation. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isGuest) {
        return true;
      } else if (reservationId) {
        await reservationService.markAsPaid(reservationId);

        if (foodItems.length > 0) {
          const foodOrderRequest = {
            deliveryType: foodDeliveryType,
            reservationId,
            orderItems: foodItems.map((item) => ({
              foodItemId: item.foodItemId,
              quantity: item.quantity,
              specialInstructions: item.specialInstructions,
            })),
          };

          await fetch("/api/food-orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(foodOrderRequest),
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Payment processing failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const completeGuestBooking = async (
    showtimeId: number
  ): Promise<{ reservationId: number }> => {
    setIsLoading(true);
    setError(null);

    try {
      const guestReservationId = new Date().getTime();

      let currentShowtime = showtime;
      if (!currentShowtime) {
        currentShowtime = await fetch(`/api/showtimes/${showtimeId}`).then(
          (res) => res.json()
        );
      }

      const guestReservation = {
        id: guestReservationId,
        reservationId: guestReservationId,
        movieTitle: currentShowtime.movieTitle,
        theaterName: currentShowtime.theaterName,
        screenName: currentShowtime.screenName,
        showtimeStartTime: currentShowtime.startTime,
        showtimeId: showtimeId,
        totalAmount: calculateTotal(),
        isPaid: true,
        reservationTime: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        tickets: selectedSeats.map((seatId) => {
          let seatRow = "";
          let seatNumber = 0;

          if (seatingLayout) {
            for (const rowKey in seatingLayout.rows) {
              const seat = seatingLayout.rows[rowKey].find(
                (s) => s.id === seatId
              );
              if (seat) {
                seatRow = seat.row;
                seatNumber = seat.number;
                break;
              }
            }
          }

          const ticketType = ticketTypes[seatId] || "Adult";
          let price = currentShowtime.ticketPrice;

          if (ticketType === "Child") price *= 0.75; // 25% off
          if (ticketType === "Senior") price *= 0.8; // 20% off

          return {
            id: seatId,
            seatId,
            row: seatRow,
            number: seatNumber,
            ticketType: ticketType,
            price: price,
          };
        }),
        foodItems: foodItems.length > 0 ? foodItems : undefined,
        foodDeliveryType: foodItems.length > 0 ? foodDeliveryType : undefined,
      };

      // Store in localStorage for guest users
      const existingTicketsStr = localStorage.getItem("guestTickets");
      const guestTickets = existingTicketsStr
        ? JSON.parse(existingTicketsStr)
        : [];

      guestTickets.push({
        reservationId: guestReservationId,
        movieTitle: guestReservation.movieTitle,
        theaterName: guestReservation.theaterName,
        screenName: guestReservation.screenName,
        showtimeStartTime: guestReservation.showtimeStartTime,
        totalAmount: guestReservation.totalAmount,
        tickets: guestReservation.tickets,
        foodItems: guestReservation.foodItems,
        foodDeliveryType: guestReservation.foodDeliveryType,
        purchaseDate: new Date().toISOString(),
      });

      localStorage.setItem("guestTickets", JSON.stringify(guestTickets));

      localStorage.removeItem("bookingProgress");

      return { reservationId: guestReservationId };
    } catch (error) {
      console.error("Error completing guest booking:", error);
      setError("Failed to complete booking. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodItem = (foodItem: any, quantity: number) => {
    setFoodItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.foodItemId === foodItem.id
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Adds new item
        return [
          ...prev,
          {
            foodItemId: foodItem.id,
            foodItemName: foodItem.name,
            price: foodItem.price,
            quantity,
            specialInstructions: "",
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
          newItems[existingItemIndex].quantity -= 1;
          return newItems;
        } else {
          return prev.filter((item) => item.foodItemId !== foodItemId);
        }
      }

      return prev;
    });
  };

  const saveBookingProgress = (): void => {
    try {
      const bookingData = JSON.stringify({
        showtimeId,
        selectedSeats,
        ticketTypes,
        reservationId,
        foodItems,
        foodDeliveryType,
        timestamp: new Date().toISOString(),
        isGuest,
      });

      localStorage.setItem("bookingProgress", bookingData);
    } catch (error) {
      console.error("Error saving booking progress:", error);
    }
  };

  const loadBookingProgress = (): boolean => {
    try {
      const bookingData = localStorage.getItem("bookingProgress");

      if (bookingData) {
        const parsed = JSON.parse(bookingData);
        //make checks for validity
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
          setIsGuest(parsed.isGuest || false);

          if (parsed.showtimeId && !showtime) {
            loadShowtime(parsed.showtimeId);
          }

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
    setReservation(null);
    setFoodItems([]);
    setFoodDeliveryType("Pickup");
    setTotalAmount(0);
    setSeatingLayout(null);
    setError(null);
    setIsGuest(false);

    localStorage.removeItem("bookingProgress");
  };

  return (
    <BookingContext.Provider
      value={{
        showtimeId,
        selectedSeats,
        ticketTypes,
        reservationId,
        reservation,
        foodItems,
        foodDeliveryType,
        totalAmount,
        seatingLayout,
        paymentMethod,
        isGuest,
        isLoading,
        error,
        loadShowtime,
        loadSeatingLayout,
        loadReservation,
        toggleSeatSelection,
        setTicketType,
        calculateTotal,
        createReservation,
        processPayment,
        addFoodItem,
        removeFoodItem,
        setFoodDeliveryType,
        setPaymentMethod,
        setIsGuest,
        resetBooking,
        saveBookingProgress,
        loadBookingProgress,
        completeGuestBooking,
      }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
