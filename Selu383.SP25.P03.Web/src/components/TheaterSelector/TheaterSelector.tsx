import React from "react";
import { Theater } from "../../types/Theater";
import "./TheaterSelector.css";

interface TheaterSelectorProps {
  theaters: Theater[];
  selectedTheater: Theater | null;
  onSelectTheater: (theater: Theater) => void;
}

const TheaterSelector: React.FC<TheaterSelectorProps> = ({
  theaters,
  selectedTheater,
  onSelectTheater,
}) => {
  if (theaters.length === 0) {
    return <div className="no-theaters">No theaters available</div>;
  }

  return (
    <div className="theater-selector">
      <div className="theater-selector-inner">
        <div className="theater-options">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className={`theater-option ${
                selectedTheater?.id === theater.id ? "active" : ""
              }`}
              onClick={() => onSelectTheater(theater)}
            >
              <span className="theater-name">{theater.name}</span>
              <span className="theater-location">{theater.address}</span>
              <span className="theater-screens">{theater.seatCount} Seats</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterSelector;
