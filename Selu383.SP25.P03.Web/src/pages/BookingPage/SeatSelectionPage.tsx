import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import SeatMap from '../../components/SeatMap/SeatMap';
import './SeatSelectionPage.css';

const SeatSelectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useBooking();
 

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        await booking.loadShowtime(Number(id));
        await booking.loadSeatingLayout(Number(id));
      } catch (error) {
        console.error('Failed to load seat selection data:', error);
        alert('Failed to load seating information. Please try again.');
      }
    };

    loadData();
    booking.loadBookingProgress();

    return () => {
      booking.saveBookingProgress();
    };
  }, [id]);

  const handleContinue = async () => {
    if (booking.selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }

    // Save current progress
    booking.saveBookingProgress();

    // Proceed to payment page
    navigate(`/payment/${id}`);
  };

  const renderTicketTypeSelector = (seatId: number) => {
    const ticketTypes = ['Adult', 'Child', 'Senior'];
    return (
      <div className="ticket-type-selector">
        {ticketTypes.map((type) => (
          <button
            key={type}
            className={`type-button ${
              (booking.ticketTypes[seatId] || 'Adult') === type ? 'selected' : ''
            }`}
            onClick={() => booking.setTicketType(seatId, type)}
          >
            {type}
          </button>
        ))}
      </div>
    );
  };

  if (booking.isLoading || !booking.seatingLayout) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Loading seating layout...</p>
      </div>
    );
  }

  return (
    <div className="seat-selection-page">
      <div className="seat-selection-header">
        <h1>Select Your Seats</h1>
        {booking.error && <div className="error-message">{booking.error}</div>}
      </div>

      <div className="seating-section">
        <div className="screen-container">
          <div className="screen">
            <span className="screen-text">SCREEN</span>
          </div>
        </div>

        <SeatMap
          seatingLayout={booking.seatingLayout}
          selectedSeats={booking.selectedSeats}
          onSeatSelect={booking.toggleSeatSelection}
        />

        <div className="legend">
          <div className="legend-item">
            <div className="seat-icon available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat-icon selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat-icon taken"></div>
            <span>Taken</span>
          </div>
        </div>
      </div>

      {booking.selectedSeats.length > 0 && (
        <div className="selected-seats-section">
          <h2>Selected Seats</h2>
          <div className="selected-seats-list">
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

              return (
                <div key={seatId} className="selected-seat-item">
                  <div className="seat-label">Seat {seatLabel}</div>
                  {renderTicketTypeSelector(seatId)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="summary-section">
        <div className="summary-row">
          <span>Selected Seats:</span>
          <span>
            {booking.selectedSeats.length > 0
              ? booking.selectedSeats
                  .map((seatId) => {
                    // Find seat label
                    if (booking.seatingLayout) {
                      for (const rowKey in booking.seatingLayout.rows) {
                        const seat = booking.seatingLayout.rows[rowKey].find(
                          (s) => s.id === seatId
                        );
                        if (seat) return `${seat.row}${seat.number}`;
                      }
                    }
                    return "";
                  })
                  .join(", ")
              : "None"}
          </span>
        </div>
        <div className="summary-row">
          <span>Ticket Count:</span>
          <span>{booking.selectedSeats.length}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${booking.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className={`continue-button ${
            booking.selectedSeats.length === 0 ? "disabled" : ""
          }`}
          onClick={handleContinue}
          disabled={booking.selectedSeats.length === 0}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default SeatSelectionPage;