import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getShowtime } from "../../services/showtimeService";
import { getSeatsForShowtime } from "../../services/seatService";
import { getTicketPrices } from "../../services/ticketService";
import { Seat, TicketType, CartItem } from "../../types/booking";
import { useCart } from "../../contexts/CartContext";
import "./BookingPage.css";

const BookingPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const { cartItems, addToCart } = useCart();

  // State for showtime details
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for seats
  const [seatingLayout, setSeatingLayout] = useState<Record<string, Seat[]>>({});
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // State for ticket types
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  // State for modal
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    const fetchShowtimeData = async () => {
      if (!showtimeId) return;

      try {
        setLoading(true);

        // Fetch showtime details
        const showtimeData = await getShowtime(parseInt(showtimeId));
        setShowtime(showtimeData);

        // Fetch seats for this showtime
        const seatsData = await getSeatsForShowtime(parseInt(showtimeId));
        setSeatingLayout(seatsData.rows || {});
        
        // Fetch ticket types and prices from API
        try {
          const ticketPricesData = await getTicketPrices(parseInt(showtimeId));
          setTicketTypes(ticketPricesData);
        } catch (error) {
          console.error("Error fetching ticket prices:", error);
          // API not yet fully implemented - in a real production app, this should be handled better
          // by showing an appropriate error message or implementing a retry mechanism
        }
      } catch (err) {
        console.error("Error fetching showtime data:", err);
        setError("Failed to load booking information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeData();
  }, [showtimeId]);

  // Handle seat selection
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "Taken") return;

    // If this seat is already selected, deselect it
    if (selectedSeat && selectedSeat.id === seat.id) {
      setSelectedSeat(null);
      return;
    }

    // Otherwise, select the seat
    setSelectedSeat(seat);
  };

  // Handle ticket type selection
  const handleTicketCountChange = (type: "Adult" | "Child" | "Senior", change: number) => {
    const updatedTicketTypes = ticketTypes.map((ticket) => {
      if (ticket.type === type) {
        const newCount = Math.max(0, ticket.count + change);
        return { ...ticket, count: newCount };
      }
      return ticket;
    });

    setTicketTypes(updatedTicketTypes);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedSeat) {
      alert("Please select a seat first");
      return;
    }

    const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.count, 0);
    
    if (totalTickets === 0) {
      alert("Please select at least one ticket");
      return;
    }

    if (totalTickets > 1) {
      alert("Only one ticket per seat is allowed");
      return;
    }

    // Get the selected ticket type (the one with count > 0)
    const selectedTicketType = ticketTypes.find(ticket => ticket.count > 0);
    
    if (!selectedTicketType) {
      alert("Please select a ticket type");
      return;
    }

    // Create a cart item
    const cartItem: CartItem = {
      seatId: selectedSeat.id,
      seatLabel: `${selectedSeat.row}${selectedSeat.number}`,
      ticketType: selectedTicketType.type,
      price: selectedTicketType.price,
      showtimeId: parseInt(showtimeId || '0'),
      movieTitle: showtime.movieTitle
    };

    // Add to cart using context
    addToCart(cartItem);

    // Reset selection
    setSelectedSeat(null);
    setTicketTypes(ticketTypes.map(ticket => ({ ...ticket, count: 0 })));

    // Show the cart modal
    setIsCartModalOpen(true);
  };

  // Handle continuing to checkout
  const handleContinue = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // To be implemented in future
    setIsCartModalOpen(false);
  };

  // Close cart modal
  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading booking information...</div>;
  }

  // Error state
  if (error || !showtime) {
    return <div className="error-container">{error || "Showtime not found"}</div>;
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{showtime.movieTitle}</h1>
        <div className="showtime-info">
          <span className="theater-name">{showtime.theaterName}</span>
          <span className="screen-name">{showtime.screenName}</span>
          <span className="start-time">
            {new Date(showtime.startTime).toLocaleString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="booking-content">
        <div className="seating-section">
          <h2>Select Your Seat</h2>
          
          <div className="screen-indicator">
            <div className="screen">Screen</div>
          </div>

          <div className="seating-layout">
            {Object.entries(seatingLayout).sort().map(([row, seats]) => (
              <div key={row} className="row">
                <div className="row-label">{row}</div>
                <div className="seats">
                  {seats.sort((a, b) => a.number - b.number).map((seat) => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status.toLowerCase()} ${
                        selectedSeat?.id === seat.id ? "selected" : ""
                      }`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.number}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-sample available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample taken"></div>
              <span>Taken</span>
            </div>
          </div>
        </div>

        <div className="ticket-selection">
          <h2>Select Ticket Type</h2>
          
          {selectedSeat ? (
            <div className="selected-seat-info">
              Selected Seat: <strong>{selectedSeat.row}{selectedSeat.number}</strong>
            </div>
          ) : (
            <div className="no-seat-selected">Please select a seat first</div>
          )}

          <div className="ticket-types">
            {ticketTypes.map((ticket) => (
              <div key={ticket.type} className="ticket-type">
                <div className="ticket-info">
                  <span className="ticket-name">{ticket.type}</span>
                  <span className="ticket-price">${ticket.price.toFixed(2)}</span>
                </div>
                <div className="ticket-quantity">
                  <button 
                    className="quantity-btn decrease" 
                    onClick={() => handleTicketCountChange(ticket.type, -1)}
                    disabled={ticket.count === 0 || !selectedSeat}
                  >
                    -
                  </button>
                  <span className="quantity">{ticket.count}</span>
                  <button 
                    className="quantity-btn increase" 
                    onClick={() => handleTicketCountChange(ticket.type, 1)}
                    disabled={!selectedSeat}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-to-cart">
            <button 
              className="add-btn" 
              onClick={handleAddToCart}
              disabled={!selectedSeat || ticketTypes.every(t => t.count === 0)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartModalOpen && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="cart-modal-header">
              <h2>Your Cart</h2>
              <button className="close-modal" onClick={handleCloseCartModal}>✕</button>
            </div>
            
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="item-details">
                        <span className="seat-label">Seat {item.seatLabel}</span>
                        <span className="ticket-type">{item.ticketType}</span>
                      </div>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>
                      ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="cart-actions">
              <button className="continue-btn" onClick={handleContinue}>
                Continue to Checkout
              </button>
              <button className="keep-shopping-btn" onClick={handleCloseCartModal}>
                Keep Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;