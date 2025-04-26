// Update PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext'; // Make sure this is imported
import { getShowtime } from '../../services/showtimeService';
import { getMovie } from '../../services/movieService';
import { Showtime } from '../../types/Showtime';
import { Movie } from '../../types/Movie';
import { CartItem } from '../../types/booking';
import { SeatingData, SeatInfo } from '../../types/seatingData';
import Footer from '../../components/Footer/Footer';
import './PaymentPage.css';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth(); // Use Auth context
  
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Set isGuest based on auth status
  const [isGuest, setIsGuest] = useState(!isAuthenticated);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update isGuest when auth status changes
  useEffect(() => {
    setIsGuest(!isAuthenticated);
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
        console.error('Error fetching booking data:', err);
        setError('Failed to load payment information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Check if cart is empty and redirect if necessary
  useEffect(() => {
    if (!loading && cartItems.length === 0 && !processingPayment && !paymentSuccess) {
      navigate(`/booking/${id}`);
    }
  }, [loading, cartItems, id, navigate, processingPayment, paymentSuccess]);

  // Handle card number formatting
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    return formatted.trim().slice(0, 19);
  };

  // Handle expiry date formatting (MM/YY)
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate card number
    if (!cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Validate card name
    if (!cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    }
    
    // Validate expiry date
    if (!expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        errors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    // Validate CVV
    if (!cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    // Validate email (only for guests)
    if (isGuest && !email.trim()) {
      errors.email = 'Email is required';
    } else if (isGuest && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && showtime) {
      setProcessingPayment(true);
      
      try {
        // First, log in as a guest user if needed
        if (isGuest) {
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
            throw new Error('Failed to authenticate guest session');
          }
        }
        
        // Fetch an available seat for testing
        const availableSeat = await fetchAvailableSeat(showtime.id);
        
        let ticketsToUse;
        if (availableSeat) {
          // Use the available seat we found
          ticketsToUse = [{
            seatId: availableSeat.id,
            ticketType: 'Adult',
            price: showtime.ticketPrice
          }];
        } else {
       // Fallback to using the original cart items
       ticketsToUse = cartItems.map(item => ({
        seatId: item.seatId,
        ticketType: item.ticketType,
        price: item.price
      }));
    }

    const checkoutRequest = {
      reservationRequest: {
        showtimeId: showtime.id,
        tickets: ticketsToUse,
        processPayment: false
      },
      foodOrders: [],
      paymentInfo: {
        amount: total,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate: expiryDate,
        cvv: cvv,
        cardholderName: cardName,
        paymentMethod: 'CreditCard'
      }
    };

    console.log('Processing checkout with data:', checkoutRequest);

    const checkoutResponse = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(checkoutRequest)
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('Checkout failed with status:', checkoutResponse.status);
      console.error('Error details:', errorText);
      
      throw new Error(errorText || 'Checkout failed');
    }

    const result = await checkoutResponse.json();
    console.log('Checkout result:', result);
    
    if (result.paymentResult?.success) {
      setPaymentSuccess(true);
      clearCart();
      
      if (isGuest) {
        sessionStorage.setItem('guestEmail', email);
      }
      
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            reservationId: result.reservation.id, 
            isGuest: isGuest,
            paymentId: result.paymentResult.paymentId,
            totalAmount: result.totalAmount
          },
          replace: true 
        });
      }, 2000);
    } else {
      throw new Error(result.paymentResult?.message || 'Payment failed');
    }
  } catch (err) {
    console.error('Payment error:', err);
    setError(err instanceof Error ? err.message : 'Payment processing failed. Please try again.');
    setProcessingPayment(false);
  }
}
};

const fetchAvailableSeat = async (showtimeId: number): Promise<SeatInfo | null> => {
try {
  const response = await fetch(`/api/seats/showtime/${showtimeId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch seats');
  }
  
  const seatingData: SeatingData = await response.json();
  
  // Find available seats
  const availableSeats = Object.values(seatingData.rows)
    .flat()
    .filter((seat): seat is SeatInfo => 
      typeof seat === 'object' && 
      seat !== null && 
      'status' in seat && 
      seat.status === 'Available'
    );
  
  if (availableSeats.length > 0) {
    // Return the first available seat
    return availableSeats[0];
  }
  
  return null;
} catch (error) {
  console.error('Error fetching available seat:', error);
  return null;
}
};

// Format date for display
const formatDate = (dateString: string) => {
return new Date(dateString).toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
};

// Format time for display
const formatTime = (dateString: string) => {
return new Date(dateString).toLocaleTimeString(undefined, {
  hour: 'numeric',
  minute: '2-digit'
});
};

// If loading
if (loading) {
return (
  <div className="payment-page">
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading payment information...</p>
    </div>
  </div>
);
}

// If error
if (error || !showtime || !movie || (cartItems.length === 0 && !processingPayment && !paymentSuccess)) {
return (
  <div className="payment-page">
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error || 'Your cart is empty or the selected showtime could not be found.'}</p>
      <button className="btn" onClick={() => navigate('/')}>Return to Home</button>
    </div>
  </div>
);
}

// If payment success
if (paymentSuccess) {
return (
  <div className="payment-page">
    <div className="payment-success">
      <div className="success-icon">✓</div>
      <h2>Payment Successful!</h2>
      <p>Your tickets have been booked successfully.</p>
      <p>A confirmation email will be sent to {email}.</p>
      <p>You will be redirected to the confirmation page shortly...</p>
    </div>
  </div>
);
}

return (
<div className="payment-page">
  <div className="payment-container">
    <h1>Complete Your Payment</h1>
    
    {/* Guest checkout notice */}
    {isGuest && (
      <div className="guest-notice">
        <p>Checking out as a guest? Your tickets will be sent to the email address you provide.</p>
        <p>Already have an account? <button onClick={() => navigate('/login', { state: { from: `/payment/${id}` } })} className="link-button">Sign in here</button></p>
      </div>
    )}
    
    <div className="payment-content">
      {/* Order summary section */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        
        <div className="movie-info">
          <div className="movie-details">
            <h3>{movie.title}</h3>
            <p><strong>Date:</strong> {formatDate(showtime.startTime)}</p>
            <p><strong>Time:</strong> {formatTime(showtime.startTime)}</p>
            <p><strong>Theater:</strong> {showtime.theaterName}</p>
            <p><strong>Screen:</strong> {showtime.screenName}</p>
          </div>
        </div>
        
        <div className="tickets-summary">
          <h3>Tickets</h3>
          
          <div className="tickets-list">
            {cartItems.map((item: CartItem, index) => (
              <div key={index} className="ticket-item">
                <div className="ticket-info">
                  <span className="seat-label">Seat {item.seatLabel}</span>
                  <span className="ticket-type">{item.ticketType}</span>
                </div>
                <span className="ticket-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment form section */}
      <div className="payment-form-container">
        <h2>Payment Details</h2>
        
        <form className="payment-form" onSubmit={handleSubmit}>
          {isGuest && (
            <div className="form-group">
              <label htmlFor="email">Email (For ticket delivery)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              className={formErrors.cardNumber ? 'error' : ''}
              maxLength={19}
            />
            {formErrors.cardNumber && <span className="error-message">{formErrors.cardNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
              className={formErrors.cardName ? 'error' : ''}
            />
            {formErrors.cardName && <span className="error-message">{formErrors.cardName}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                className={formErrors.expiryDate ? 'error' : ''}
                maxLength={5}
              />
              {formErrors.expiryDate && <span className="error-message">{formErrors.expiryDate}</span>}
            </div>
            
            <div className="form-group half">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="XXX"
                className={formErrors.cvv ? 'error' : ''}
                maxLength={4}
              />
              {formErrors.cvv && <span className="error-message">{formErrors.cvv}</span>}
            </div>
          </div>
          
          <div className="payment-actions">
            <button 
              type="button" 
              className="btn cancel-button"
              onClick={() => navigate(`/booking/${id}`)}
              disabled={processingPayment}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn pay-button"
              disabled={processingPayment}
            >
              {processingPayment ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
        
        <div className="payment-security">
          <p>
            <i className="lock-icon">🔒</i>
            Your payment information is securely processed.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <Footer />
</div>
);
};

export default PaymentPage;