import React from "react";
import { SeatingLayout } from "../../types/booking";
import "./SeatMap.css";

interface SeatMapProps {
  seatingLayout: SeatingLayout;
  selectedSeats: number[];
  onSeatSelect: (seatId: number) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  seatingLayout,
  selectedSeats,
  onSeatSelect,
}) => {
  const sortedRowKeys = Object.keys(seatingLayout.rows).sort();

  return (
    <div className="seat-map-container">
      <div className="seat-map">
        {sortedRowKeys.map((rowKey) => (
          <div key={rowKey} className="seat-row">
            <span className="row-label">{rowKey}</span>
            <div className="seats">
              {seatingLayout.rows[rowKey].map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isTaken = seat.status === "Taken";

                return (
                  <button
                    key={seat.id}
                    className={`seat ${isTaken ? "taken" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => !isTaken && onSeatSelect(seat.id)}
                    disabled={isTaken}>
                    {seat.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
