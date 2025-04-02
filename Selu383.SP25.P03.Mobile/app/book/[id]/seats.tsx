import React, { useState, useEffect } from "react";

const SeatSelection = () => {
  //track selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  // Add more ticket price options later.
  const TICKET_PRICE = 15.0;

  //Placeholder code for seat layout until I find a better solution
  const seatLayout = {
    A: [
      { id: "A1", status: "available" },
      { id: "A2", status: "available" },
      { id: "A3", status: "taken" },
      { id: "A4", status: "taken" },
      { id: "A5", status: "available" },
      { id: "A6", status: "available" },
      { id: "A7", status: "available" },
    ],
    B: [
      { id: "B1", status: "available" },
      { id: "B2", status: "taken" },
      { id: "B3", status: "available" },
      { id: "B4", status: "available" },
      { id: "B5", status: "taken" },
      { id: "B6", status: "available" },
      { id: "B7", status: "available" },
    ],
    C: [
      { id: "C1", status: "available" },
      { id: "C2", status: "available" },
      { id: "C3", status: "available" },
      { id: "C4", status: "available" },
      { id: "C5", status: "available" },
      { id: "C6", status: "available" },
      { id: "C7", status: "taken" },
    ],
  };

  // State for the seat map (to keep track of seat statuses)
  const [seatMap, setSeatMap] = useState(seatLayout);

  // Handle seat selection

  // Handle ticket count change
  const handleTicketCountChange = (increment: boolean) => {
    const newCount = increment ? ticketCount + 1 : Math.max(0, ticketCount - 1);
    setTicketCount(newCount);
  };

  // Effect to update total price whenever selected seats change
  useEffect(() => {
    setTotalPrice(selectedSeats.length * TICKET_PRICE);
  }, [selectedSeats]);

  // Effect to update ticket count whenever selected seats change
  useEffect(() => {
    setTicketCount(selectedSeats.length);
  }, [selectedSeats]);

  // Function to handle checkout
  const handleCheckout = () => {
    // In a real app, this would save to the user's profile or proceed to checkout
    console.log("Selected seats:", selectedSeats);
    console.log("Total price:", totalPrice);

    // API call example (commented out)
    // saveSeatsToUserProfile(selectedSeats)
    //   .then(() => navigate('/payment'))
    //   .catch(error => setError(error));

    alert(`Proceeding to checkout with seats: ${selectedSeats.join(", ")}`);
  };

  function handleSeatClick(id: string, rowId: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container">
      <div className="header">
        <span className="back-btn">←</span>
        <h1>Select Seats</h1>
        <span className="help-btn">?</span>
      </div>

      <div className="movie-details">
        <h2 className="movie-title">Dune: Part Two</h2>
        <div className="movie-time">Today, March 15 · 7:30 PM</div>
      </div>

      <div className="screen-container">
        <div className="screen">Screen</div>

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

        <div className="seating-plan">
          {/* Render rows and seats dynamically */}
          {Object.entries(seatMap).map(([rowId, seats]) => (
            <React.Fragment key={rowId}>
              <div className="row-label">{rowId}</div>
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.status}`}
                  onClick={() => handleSeatClick(seat.id, rowId)}
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="ticket-section">
        <h3 className="ticket-title">Ticket Type</h3>

        <div className="ticket-type">
          <div className="ticket-info">
            <span className="ticket-name">Adult</span>
            <span className="ticket-price">${TICKET_PRICE.toFixed(2)}</span>
          </div>

          <div className="counter">
            <div
              className="counter-btn decrement"
              onClick={() => handleTicketCountChange(false)}
            >
              -
            </div>
            <div className="counter-value">{ticketCount}</div>
            <div
              className="counter-btn increment"
              onClick={() => handleTicketCountChange(true)}
            >
              +
            </div>
          </div>
        </div>
      </div>

      <div className="summary">
        <div className="selected-seats">
          <div className="selected-seats-label">Selected Seats</div>
          <div>
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "None selected"}
          </div>
        </div>

        <div className="total">
          Total
          <br />${totalPrice.toFixed(2)}
        </div>
      </div>

      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={selectedSeats.length === 0}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default SeatSelection;
