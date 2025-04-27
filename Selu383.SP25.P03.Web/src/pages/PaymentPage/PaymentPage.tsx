import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { getShowtime } from "../../services/showtimeService";
import { getMovie } from "../../services/movieService";
import { Showtime } from "../../types/Showtime";
import { Movie } from "../../types/Movie";
import { CartItem } from "../../types/booking";
import Footer from "../../components/Footer/Footer";
import * as guestSessionService from "../../services/guestSessionsService";
import "./PaymentPage.css";

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cartItems, total } = useCart();
  const { isAuthenticated } = useAuth();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  // Demo card data
  const demoCards = [
    { type: "Visa", last4: "4242", brand: "visa" },
    { type: "Mastercard", last4: "5555", brand: "mastercard" },
    { type: "American Express", last4: "8888", brand: "amex" },
  ];
  const [selectedCard, setSelectedCard] = useState(demoCards[0]);

  // Initialize guest session if needed
  useEffect(() => {
    const initializeGuestSession = async () => {
      if (!isAuthenticated) {
        try {
          let sessionId = guestSessionService.getGuestSessionId();
          if (!sessionId) {
            sessionId = await guestSessionService.createGuestSession();
          }
          setGuestSessionId(sessionId);
        } catch (error) {
          console.error("Failed to initialize guest session:", error);
        }
      }
    };

    initializeGuestSession();
  }, [isAuthenticated]);

  // Fetch showtime and movie data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const showtimeData = await getShowtime(parseInt(id));
        setShowtime(showtimeData);
        const movieData = await getMovie(showtimeData.movieId);
        setMovie(movieData);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError("Failed to load payment information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Check if cart is empty and redirect if necessary
  useEffect(() => {
    if (
      !loading &&
      cartItems.length === 0 &&
      !processingPayment &&
      !paymentSuccess
    ) {
      navigate(`/booking/${id}`);
    }
  }, [loading, cartItems, id, navigate, processingPayment, paymentSuccess]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting payment submission...");

    if (showtime) {
      setProcessingPayment(true);
      console.log("Processing payment for showtime:", showtime.id);
      console.log("Cart items:", cartItems);
      console.log("Total amount:", total);
      console.log("Is user authenticated:", isAuthenticated);
      console.log("Guest session ID:", guestSessionId);

      try {
        // Separate food items and seat items
        const seatItems = cartItems.filter((item) => item.type !== "food");
        const foodItems = cartItems.filter((item) => item.type === "food");

        // Group food items by ID
        const foodItemGroups: {
          [key: number]: { quantity: number; name: string };
        } = {};
        foodItems.forEach((item) => {
          if (!foodItemGroups[item.id]) {
            foodItemGroups[item.id] = {
              quantity: 0,
              name: String(item.name) || "Unknown Item",
            };
          }
          foodItemGroups[item.id].quantity++;
        });

        // Create food order request if there are food items
        let foodOrders: {
          deliveryType: string;
          orderItems: {
            foodItemId: number;
            foodItemName: string;
            quantity: number;
            specialInstructions?: string;
          }[];
        }[] = [];

        if (foodItems.length > 0) {
          foodOrders = [
            {
              deliveryType: "Pickup",
              orderItems: Object.entries(foodItemGroups).map(
                ([id, details]) => {
                  return {
                    foodItemId: parseInt(id),
                    foodItemName: details.name, // Include the foodItemName
                    quantity: details.quantity,
                    specialInstructions: "",
                  };
                }
              ),
            },
          ];
        }

        // Create the full request object that matches the API expectation
        // FIXED: Removed the 'request' wrapper to match API expectations
        const paymentRequest = {
          reservationRequest:
            seatItems.length > 0
              ? {
                  showtimeId: showtime.id,
                  tickets: seatItems.map((item) => ({
                    seatId: item.seatId,
                    ticketType: item.ticketType,
                    price: item.price,
                  })),
                  processPayment: false,
                }
              : null,
          foodOrders: foodOrders,
          paymentInfo: {
            amount: total,
            cardNumber: "4242424242424242", // Demo card number
            expiryDate: "12/25",
            cvv: "123",
            cardholderName: selectedCard.type + " User",
            paymentMethod: "CreditCard",
          },
        };

        console.log("Payment request:", paymentRequest);

        // Send the payment request to the API
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(paymentRequest),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Payment failed with status:", response.status);
          console.error("Error details:", errorText);
          throw new Error(errorText || "Payment failed");
        }

        const result = await response.json();
        console.log("Payment result:", result);

        // If guest, add the reservation to the guest session
        if (!isAuthenticated && guestSessionId && result.reservation?.id) {
          try {
            await guestSessionService.addReservationToGuestSession(
              guestSessionId,
              result.reservation.id
            );
            console.log("Added reservation to guest session successfully");
          } catch (error) {
            console.error("Failed to add reservation to guest session:", error);
            // Continue anyway as the reservation was created successfully
          }
        }

        // Navigate to confirmation page with all necessary data
        navigate("/confirmation", {
          state: {
            reservationId: result.reservation?.id,
            isGuest: !isAuthenticated,
            guestSessionId: guestSessionId,
            totalAmount: result.totalAmount || total,
            paymentResult: result, // Pass the entire result for fallback
            // Also pass individual fields in case needed
            movieTitle: movie?.title,
            theaterName: showtime?.theaterName,
            showtimeStartTime: showtime?.startTime,
            screenName: showtime?.screenName,
            tickets: cartItems.map((item) => ({
              row: item.seatLabel ? item.seatLabel[0] : "A",
              number: item.seatLabel ? parseInt(item.seatLabel.slice(1)) : 1,
              ticketType: item.ticketType,
              price: item.price,
            })),
          },
          replace: true,
        });
      } catch (err) {
        console.error("Payment processing error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Payment processing failed. Please try again."
        );
        setProcessingPayment(false);
      }
    } else {
      console.error("No showtime available for payment");
      setError("No showtime selected. Please go back and select a showtime.");
    }
  };

  // Format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Loading payment information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (
    error ||
    !showtime ||
    !movie ||
    (cartItems.length === 0 && !processingPayment && !paymentSuccess)
  ) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>
            {error ||
              "Your cart is empty or the selected showtime could not be found."}
          </p>
          <button className="btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentSuccess) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div
            className="success-icon"
            style={{ color: "#65a30d", fontSize: "3rem", marginBottom: "1rem" }}
          >
            ✓
          </div>
          <h2 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Payment Successful!
          </h2>
          <p style={{ color: "#cbd5e1" }}>
            Your tickets have been booked successfully.
          </p>
          <p style={{ color: "#cbd5e1" }}>
            Redirecting to confirmation page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-header">
        <h1>Complete Your Payment</h1>
        <div className="booking-details">
          <div className="movie-poster">
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder-poster.jpg";
              }}
            />
          </div>
          <div className="booking-movie-info">
            <h2>{movie.title}</h2>
            <p>
              <strong>Date:</strong> {formatDate(showtime.startTime)}
            </p>
            <p>
              <strong>Time:</strong> {formatTime(showtime.startTime)}
            </p>
            <p>
              <strong>Theater:</strong> {showtime.theaterName}
            </p>
            <p>
              <strong>Screen:</strong> {showtime.screenName}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="booking-content">
        {/* Left column - Order Summary */}
        <div className="seating-container">
          <h3
            style={{
              fontSize: "1.25rem",
              marginBottom: "1.5rem",
              color: "#ffffff",
            }}
          >
            Order Summary
          </h3>

          <div className="seat-list">
            {cartItems.map((item: CartItem, index) => (
              <div key={index} className="selected-seat-item">
                <div className="seat-info">
                  <span className="seat-label">Seat {item.seatLabel}</span>
                  <span className="ticket-type" style={{ color: "#cbd5e1" }}>
                    {item.ticketType}
                  </span>
                </div>
                <span className="ticket-price" style={{ color: "#65a30d" }}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="price-summary">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right column - Payment Form */}
        <div className="booking-sidebar">
          <div className="selected-seats">
            <h3>Payment Details</h3>

            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "rgba(101, 163, 13, 0.1)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  background: "#65a30d",
                  color: "#000",
                  borderRadius: "20px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                DEMO MODE
              </span>
              <p style={{ color: "#65a30d", fontSize: "0.875rem", margin: 0 }}>
                Payment is simulated for demonstration
              </p>
            </div>

            <div
              style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
            >
              {demoCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCard(card)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background:
                      selectedCard === card
                        ? "rgba(101, 163, 13, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    border:
                      selectedCard === card
                        ? "2px solid #65a30d"
                        : "2px solid transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#ffffff",
                    }}
                  >
                    {card.type}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      color: "#cbd5e1",
                      fontSize: "0.875rem",
                    }}
                  >
                    •••• {card.last4}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="checkout-button"
              onClick={handleSubmit}
              disabled={processingPayment}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {processingPayment ? (
                <>
                  <div
                    className="loader"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderWidth: "2px",
                    }}
                  ></div>
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#cbd5e1",
                marginTop: "1rem",
              }}
            >
              This is a demo. No actual payment will be processed.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
