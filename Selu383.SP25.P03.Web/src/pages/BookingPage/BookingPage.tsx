import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Showtime } from '../../types/Showtime';
import { Movie } from '../../types/Movie';
import { getShowtime } from '../../services/showtimeService';
import { getMovie } from '../../services/movieService';
import { getSeatsForShowtime } from '../../services/seatService';
import { SeatingLayout, Seat, SeatStatus, TicketType } from '../../types/booking';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../types/booking';
import Footer from '../../components/Footer/Footer';
import './BookingPage1.css';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for data
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for selections
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<number, string>>({});
  
  // Pricing options with fixed multiplier values
  const [ticketOptions] = useState<TicketType[]>([
    { type: "Adult", price: 0, count: 0, multiplier: 1 },
    { type: "Child", price: 0, count: 0, multiplier: 0.75 },
    { type: "Senior", price: 0, count: 0, multiplier: 0.8 }
  ]);
  
  const { addToCart, clearCart } = useCart();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get the showtime
        const showtimeData = await getShowtime(parseInt(id));
        setShowtime(showtimeData);
        
        // Get the movie
        const movieData = await getMovie(showtimeData.movieId);
        setMovie(movieData);
        
        // Get the seating layout
        const layoutData = await getSeatsForShowtime(parseInt(id));
        setSeatingLayout(layoutData);
        
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Handle seat selection
  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === SeatStatus.Taken) return;
    
    // If seat is already selected, remove it
    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(prevSeats => prevSeats.filter(s => s.id !== seat.id));
      
      // Also remove from ticket types
      setTicketTypes(prevTypes => {
        const newTypes = { ...prevTypes };
        delete newTypes[seat.id];
        return newTypes;
      });
    } 
    // Otherwise, add it
    else {
      setSelectedSeats(prevSeats => [...prevSeats, seat]);
      
      // Default to Adult ticket type
      setTicketTypes(prevTypes => ({
        ...prevTypes,
        [seat.id]: 'Adult'
      }));
    }
  };

  // Handle ticket type change
  const handleTicketTypeChange = (seatId: number, type: string) => {
    setTicketTypes(prevTypes => ({
      ...prevTypes,
      [seatId]: type
    }));
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!showtime) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      const type = ticketTypes[seat.id] || 'Adult';
      const option = ticketOptions.find(opt => opt.type === type);
      return total + (showtime.ticketPrice * (option?.multiplier || 1));
    }, 0);
  };

  // Proceed to checkout
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    
    if (!showtime || !movie) {
      alert('Missing showtime or movie information. Please try again.');
      return;
    }
    
    // In a real implementation, you'd make an API call to create a reservation
    // For now, we'll just add the selected seats to the cart
    
    // Clear existing cart items first
    clearCart();
    
    // Add selected seats to cart
    selectedSeats.forEach(seat => {
      const ticketType = ticketTypes[seat.id] || 'Adult';
      const option = ticketOptions.find(opt => opt.type === ticketType);
      
      const cartItem: CartItem = {
        seatId: seat.id,
        seatLabel: `${seat.row}${seat.number}`,
        ticketType,
        price: showtime.ticketPrice * (option?.multiplier || 1),
        showtimeId: showtime.id,
        movieTitle: movie.title
      };
      
      addToCart(cartItem);
    });
    
    // Navigate to payment page
    navigate(`/payment/${id}`);
  };

  // Format a row of seats
  const renderSeatRow = (rowKey: string, seats: Seat[]) => {
    return (
      <div key={rowKey} className="seat-row">
        <div className="row-label">{rowKey}</div>
        <div className="seats">
          {seats.map(seat => {
            // Determine seat status
            let status: SeatStatus = seat.status;
            
            // Override status if seat is selected
            if (selectedSeats.some(s => s.id === seat.id)) {
              status = SeatStatus.Selected;
            }
            
            return (
              <button
                key={seat.id}
                className={`seat ${status === SeatStatus.Available ? 'available' : status === SeatStatus.Selected ? 'selected' : 'unavailable'}`}
                onClick={() => handleSeatSelect(seat)}
                disabled={status === SeatStatus.Taken}
                aria-label={`Seat ${seat.row}${seat.number}, ${status}`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading booking information...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !showtime || !movie || !seatingLayout) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Unable to load booking details'}</p>
          <button className="btn" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header with movie info */}
      <div className="booking-header">
        <h1>Select Your Seats</h1>
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
            <p><strong>Theater:</strong> {showtime.theaterName}</p>
            <p><strong>Screen:</strong> {showtime.screenName}</p>
            <p><strong>Date:</strong> {new Date(showtime.startTime).toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> {new Date(showtime.startTime).toLocaleTimeString(undefined, { 
              hour: 'numeric', 
              minute: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="booking-content">
        {/* Seating chart */}
        <div className="seating-container">
          <div className="screen-indicator">
            <div className="screen"></div>
            <p>Screen</p>
          </div>

          <div className="seat-map">
            {Object.entries(seatingLayout.rows).map(([rowKey, seats]) => 
              renderSeatRow(rowKey, seats)
            )}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="seat unavailable"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* Selected seats sidebar */}
        <div className="booking-sidebar">
          <div className="selected-seats">
            <h3>Selected Seats</h3>
            
            {selectedSeats.length === 0 ? (
              <p className="no-seats">No seats selected</p>
            ) : (
              <>
                <div className="seat-list">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="selected-seat-item">
                      <div className="seat-info">
                        <span className="seat-label">Seat {seat.row}{seat.number}</span>
                        <select 
                          value={ticketTypes[seat.id] || 'Adult'}
                          onChange={(e) => handleTicketTypeChange(seat.id, e.target.value)}
                        >
                          {ticketOptions.map(option => (
                            <option key={option.type} value={option.type}>
                              {option.type} ${(showtime.ticketPrice * option.multiplier).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-summary">
                  <div className="summary-item">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="checkout-button" 
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                >
                  Continue to Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingPage;