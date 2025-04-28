import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "../../components/QrCode/QrCode";
import { useAuth } from "../../contexts/AuthContext";
import * as reservationService from "../../services/reservationService";
import "./ConfirmationPage.css";

interface Ticket {
  id?: number;
  row: string;
  number: number;
  ticketType?: string;
  price?: number;
}

interface FoodItem {
  quantity: number;
  foodItemName: string;
}

interface Reservation {
  id: number;
  reservationId?: number;
  movieTitle: string;
  theaterName: string;
  showtimeStartTime: string;
  screenName: string;
  tickets: Ticket[];
  totalAmount: number;
  foodItems?: FoodItem[];
  foodDeliveryType?: string;
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { reservationId, isGuest, guestSessionId } = location.state || {};

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservationData = async () => {
      if (!reservationId) {
        setError("Reservation ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        if (isGuest && guestSessionId) {
          const paymentResult = location.state?.paymentResult;

          if (paymentResult?.reservation) {
            const reservationData = paymentResult.reservation;
            setReservation(reservationData);

            const qrData = {
              type: "ticket",
              reservationId: reservationData.id,
              movieTitle: reservationData.movieTitle || "Movie",
              theaterName: reservationData.theaterName || "Lion's Den Cinema",
              showtime:
                reservationData.showtimeStartTime || new Date().toISOString(),
              seats: reservationData.tickets
                ? reservationData.tickets
                    .map((t: Ticket) => `${t.row}${t.number}`)
                    .join(",")
                : "N/A",
              isGuest: true,
              guestSessionId: guestSessionId,
            };

            setQrCodeValue(JSON.stringify(qrData));
          } else {
            const fallbackReservation: Reservation = {
              id: reservationId,
              movieTitle: location.state?.movieTitle || "Movie",
              theaterName: location.state?.theaterName || "Lion's Den Cinema",
              showtimeStartTime:
                location.state?.showtimeStartTime || new Date().toISOString(),
              screenName: location.state?.screenName || "Screen 1",
              tickets: location.state?.tickets || [{ row: "A", number: 1 }],
              totalAmount: location.state?.totalAmount || 0,
              foodItems: location.state?.foodItems,
            };

            setReservation(fallbackReservation);
            setQrCodeValue(
              JSON.stringify({
                type: "ticket",
                reservationId: reservationId,
                isGuest: true,
                guestSessionId: guestSessionId,
              })
            );
          }
        } else {
          try {
            const reservationData = await reservationService.getReservation(
              reservationId
            );
            setReservation(reservationData);

            const qrData = {
              type: "ticket",
              reservationId: reservationData.id,
              movieTitle: reservationData.movieTitle,
              theaterName: reservationData.theaterName,
              showtime: reservationData.showtimeStartTime,
              seats: reservationData.tickets
                .map((t: Ticket) => `${t.row}${t.number}`)
                .join(","),
              isGuest: false,
              userId: user?.id,
            };

            setQrCodeValue(JSON.stringify(qrData));
          } catch (err) {
            console.error(
              "Failed to fetch reservation for authenticated user:",
              err
            );
            if (location.state?.paymentResult?.reservation) {
              setReservation(location.state.paymentResult.reservation);
              setQrCodeValue(
                JSON.stringify({
                  type: "ticket",
                  reservationId: reservationId,
                  isGuest: false,
                  userId: user?.id,
                })
              );
            } else {
              throw err;
            }
          }
        }
      } catch (err) {
        console.error("Error loading confirmation data:", err);
        setError("Failed to load ticket information");
      } finally {
        setIsLoading(false);
      }
    };

    loadReservationData();
  }, [reservationId, isGuest, guestSessionId, user?.id, location.state]);

  const handleShareTicket = async () => {
    if (!reservation) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Lion's Den Cinema Ticket",
          text: `Movie: ${reservation.movieTitle}\nTheater: ${
            reservation.theaterName
          }\nShowtime: ${new Date(
            reservation.showtimeStartTime
          ).toLocaleString()}\nSeats: ${reservation.tickets
            .map((t) => `${t.row}${t.number}`)
            .join(", ")}`,
        });
      } else {
        alert("Sharing is not supported in your browser");
      }
    } catch (error) {
      console.error("Error sharing ticket:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading your ticket...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p>{error || "Ticket not found"}</p>
        <button className="home-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Purchase Complete!</h1>
          <p>
            Your tickets have been purchased successfully. Show the QR code at
            the entrance.
          </p>
        </div>

        <div className="ticket-card">
          <div className="ticket-header">
            <div>
              <h2 className="theater-name">{reservation.theaterName}</h2>
              <p className="screen-name">
                {reservation.screenName || "Screen 1"}
              </p>
            </div>
            <div className="logo-container">🎬</div>
          </div>

          <div className="ticket-body">
            <h2 className="movie-title">{reservation.movieTitle}</h2>

            <p className="showtime-date">
              {formatDate(reservation.showtimeStartTime)}
            </p>

            <div className="seats-section">
              <h3>Seats</h3>
              <p className="seats-list">
                {reservation.tickets
                  .map((ticket) => `${ticket.row}${ticket.number}`)
                  .join(", ")}
              </p>
            </div>

            {reservation.foodItems && reservation.foodItems.length > 0 && (
              <div className="food-section">
                <h3>Food Order</h3>
                <ul className="food-list">
                  {reservation.foodItems.map((item, index) => (
                    <li key={index} className="food-item">
                      {item.quantity}x {item.foodItemName}
                    </li>
                  ))}
                </ul>
                <p className="delivery-type">
                  {reservation.foodDeliveryType === "ToSeat"
                    ? "Delivery to your seat"
                    : "Pickup at concession counter"}
                </p>
              </div>
            )}

            <div className="qr-container">
              {qrCodeValue ? (
                <QRCode value={qrCodeValue} size={200} />
              ) : (
                <div className="qr-placeholder">
                  <div className="loader small"></div>
                </div>
              )}
            </div>

            <p className="scan-instructions">
              Scan this QR code at the entrance
            </p>

            <p className="transaction-id">
              Transaction ID: {reservation.id || reservation.reservationId}
            </p>
          </div>

          <div className="ticket-footer">
            <button className="share-button" onClick={handleShareTicket}>
              <i className="fa fa-share"></i> Share Ticket
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="tickets-button"
            onClick={() => navigate("/tickets")}>
            View All Tickets
          </button>

          <button className="home-button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
