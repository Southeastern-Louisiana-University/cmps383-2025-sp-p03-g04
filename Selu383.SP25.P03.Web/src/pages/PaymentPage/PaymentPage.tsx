import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import './PaymentPage.css';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useBooking();
  const { user, isAuthenticated } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Ensure we have booking data
  useEffect(() => {
    const checkBookingData = async () => {
      if (!booking.showtimeId) {
        // If no booking data, try to load from progress
        const loaded = booking.loadBookingProgress();

        // If still no data, redirect to seat selection
        if (!loaded && id) {
          navigate(`/booking/${id}`);
        }
      }
    };

    checkBookingData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      if (isAuthenticated) {
        // For authenticated users, create a reservation first if one doesn't exist
        if (!booking.reservationId) {
          const newReservationId = await booking.createReservation();
          if (!newReservationId) {
            throw new Error('Failed to create reservation');
          }
        }
      }

      // Process payment
      const success = await booking.processPayment();

      if (success) {
        if (booking.isGuest) {
          // For guest users
          if (id) {
            const result = await booking.completeGuestBooking(Number(id));
            
            // Navigate to confirmation page with reservation details
            navigate('/confirmation', {
              state: {
                reservationId: result.reservationId,
                isGuest: true,
              },
            });
          }
        } else {
          // For authenticated users
          navigate('/confirmation', {
            state: {
              reservationId: booking.reservationId,
              isGuest: false,
            },
          });
        }

        // Reset booking state after navigating
        booking.resetBooking();
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was a problem with your payment. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePaymentForm = () => {
    // Simple validation
    if (!paymentDetails.cardNumber.trim()) {
      alert('Please enter a card number');
      return false;
    }
    if (!paymentDetails.expiryDate.trim()) {
      alert
      alert('Please enter the expiry date');
      return false;
    }
    if (!paymentDetails.cvv.trim()) {
      alert('Please enter the CVV');
      return false;
    }
    if (!paymentDetails.cardholderName.trim()) {
      alert('Please enter the cardholder name');
      return false;
    }
    return true;
  };

  // Payment methods data
  const paymentMethods = [
    { id: 'visa', label: 'Visa ending in 4242', icon: 'credit-card' },
    { id: 'mastercard', label: 'Mastercard ending in 5555', icon: 'credit-card' },
    { id: 'applepay', label: 'Apple Pay', icon: 'apple' },
    { id: 'googlepay', label: 'Google Pay', icon: 'google' },
    { id: 'new-card', label: 'Add new payment method', icon: 'plus-circle' },
  ];

  // Loading state
  if (booking.isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading payment details...</p>
      </div>
    );
  }

  // If no showtime data is available, show error
  if (!booking.showtimeId) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>No booking information found. Please start your booking process again.</p>
        <button className="back-button" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="page-title">Complete Your Purchase</h1>

        {/* Order Summary */}
        <div className="summary-card">
          <h2 className="card-title">Order Summary</h2>

          <div className="summary-content">
            {booking.selectedSeats.map((seatId) => {
              // Find seat details in seating layout
              let seatLabel = "";
              if (booking.seatingLayout) {
                for (const rowKey in booking.seatingLayout.rows) {
                  const seat = booking.seatingLayout.rows[rowKey].find(
                    (s) => s.id === seatId
                  );
                  if (seat) {
                    seatLabel = `${seat.row}${seat.number}`;
                    break;
                  }
                }
              }

              const ticketType = booking.ticketTypes[seatId] || "Adult";
              let price = booking.seatingLayout?.ticketPrice || 0;

              // Apply discount based on ticket type
              if (ticketType === "Child") price *= 0.75; // 25% off
              if (ticketType === "Senior") price *= 0.8; // 20% off

              return (
                <div key={seatId} className="summary-item">
                  <span>{ticketType} - Seat {seatLabel}</span>
                  <span>${price.toFixed(2)}</span>
                </div>
              );
            })}

            {/* Show food items if any */}
            {booking.foodItems.length > 0 && (
              <>
                <h3 className="section-title">Food Items</h3>
                {booking.foodItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span>{item.quantity}x {item.foodItemName}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}

            <div className="summary-total">
              <span>Total</span>
              <span>${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-card">
          <h2 className="card-title">Payment Method</h2>

          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method-item ${
                  booking.paymentMethod === method.id ? "selected" : ""
                }`}
                onClick={() => booking.setPaymentMethod(method.id)}
              >
                <div className="payment-method-icon">
                  <i className={`fa fa-${method.icon}`}></i>
                </div>
                <div className="payment-method-label">{method.label}</div>
                <div className="payment-method-radio">
                  <div className="radio-outer">
                    {booking.paymentMethod === method.id && (
                      <div className="radio-inner"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Card Form */}
          {booking.paymentMethod === "new-card" && (
            <div className="new-card-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={paymentDetails.cardholderName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Login/Register Prompt for Guests */}
        {!isAuthenticated && (
          <div className="auth-prompt-card">
            <h2 className="card-title">Create an Account</h2>
            <p>
              Save your tickets and get faster checkout next time by creating an
              account or signing in.
            </p>
            <div className="auth-buttons">
              <button 
                className="auth-button login" 
                onClick={() => {
                  // Save booking progress and redirect to login
                  booking.saveBookingProgress();
                  navigate('/login', { 
                    state: { returnTo: `/payment/${id}` } 
                  });
                }}
              >
                Sign In
              </button>
              <button 
                className="auth-button register"
                onClick={() => {
                  // Save booking progress and redirect to registration
                  booking.saveBookingProgress();
                  navigate('/register', { 
                    state: { returnTo: `/payment/${id}` } 
                  });
                }}
              >
                Register
              </button>
              <button 
                className="auth-button guest"
                onClick={() => booking.setIsGuest(true)}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          className={`pay-button ${isProcessing ? "disabled" : ""}`}
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="loading-spinner"></span>
          ) : (
            <>Pay ${booking.totalAmount.toFixed(2)}</>
          )}
        </button>

        <p className="secure-text">
          <i className="fa fa-lock"></i> All payments are secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;