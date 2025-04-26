import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import './ConfirmationPage.css';

interface LocationState {
  reservationId: number;
  isGuest: boolean;
  paymentId: string;
  totalAmount: number;
}

interface ReservationDetails {
  id: number;
  reservationTime: string;
  totalAmount: number;
  showtimeStartTime: string;
  movieTitle: string;
  theaterName: string;
  screenName: string;
  tickets: Array<{
    row: string;
    number: number;
    ticketType: string;
    price: number;
  }>;
}

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  // Get the state passed from payment page
  const state = location.state as LocationState;
  const guestEmail = sessionStorage.getItem('guestEmail');

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!state?.reservationId) {
        navigate('/');
        return;
      }

      try {
        // For guests, we need to authenticate first
        if (state.isGuest) {
          const loginResponse = await fetch('/api/authentication/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              userName: 'customer1',
              password: 'Password123!'
            })
          });

          if (!loginResponse.ok) {
            throw new Error('Failed to authenticate for reservation details');
          }
        }

        // Fetch reservation details
        const response = await fetch(`/api/reservations/${state.reservationId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservation details');
        }

        const data = await response.json();
        setReservation(data);

        // Try to get the QR code
        try {
          const qrResponse = await fetch(`/api/reservations/${state.reservationId}/ticket`, {
            credentials: 'include'
          });
          
          if (qrResponse.ok) {
            const blob = await qrResponse.blob();
            const qrUrl = URL.createObjectURL(blob);
            setQrCode(qrUrl);
          }
        } catch (qrError) {
          console.warn('Failed to fetch QR code:', qrError);
          // Continue without QR code
        }

      } catch (err) {
        console.error('Error fetching reservation:', err);
        setError('Failed to load reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();

    // Cleanup QR code URL on unmount
    return () => {
      if (qrCode) {
        URL.revokeObjectURL(qrCode);
      }
    };
  }, [state, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="confirmation-page">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error || 'Unable to load reservation details'}</p>
          <button className="btn" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your reservation number is: <strong>#{reservation.id}</strong></p>
          {state.isGuest && guestEmail && (
            <p>A confirmation email has been sent to: <strong>{guestEmail}</strong></p>
          )}
        </div>

        <div className="confirmation-content">
          <div className="confirmation-details">
            <h2>Reservation Details</h2>
            
            <div className="movie-info">
              <h3>{reservation.movieTitle}</h3>
              <p><strong>Date:</strong> {formatDate(reservation.showtimeStartTime)}</p>
              <p><strong>Time:</strong> {formatTime(reservation.showtimeStartTime)}</p>
              <p><strong>Theater:</strong> {reservation.theaterName}</p>
              <p><strong>Screen:</strong> {reservation.screenName}</p>
            </div>

            <div className="tickets-info">
              <h3>Tickets</h3>
              {reservation.tickets.map((ticket, index) => (
                <div key={index} className="ticket-item">
                  <span>Seat {ticket.row}{ticket.number}</span>
                  <span>{ticket.ticketType}</span>
                  <span>${ticket.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="total">
                <strong>Total Paid:</strong>
                <strong>${state.totalAmount ? state.totalAmount.toFixed(2) : reservation.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {qrCode && (
            <div className="qr-section">
              <h2>E-Ticket</h2>
              <div className="qr-code">
                <img src={qrCode} alt="Ticket QR Code" />
              </div>
              <p>Present this QR code at the theater entrance</p>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button className="btn" onClick={() => navigate('/')}>
            Return to Home
          </button>
          <button className="btn" onClick={() => window.print()}>
            Print Confirmation
          </button>
        </div>

        <div className="confirmation-notes">
          <h3>Important Information</h3>
          <ul>
            <li>Please arrive at least 15 minutes before showtime</li>
            <li>Bring your confirmation email or QR code</li>
            <li>Food and drinks can be purchased at the concession stand</li>
            {state.isGuest && (
              <li>Save this confirmation - you'll need it to access your tickets</li>
            )}
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConfirmationPage;