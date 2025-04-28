import React, { createContext, useState, useContext, useEffect } from "react";
import { getTheaters } from "../services/theaterService";
import { Theater } from "../types/Theater";

interface TheaterContextType {
  selectedTheater: Theater | null;
  theaters: Theater[];
  setSelectedTheater: (theater: Theater) => void;
}

const TheaterContext = createContext<TheaterContextType>({
  selectedTheater: null,
  theaters: [],
  setSelectedTheater: () => {},
});

export const TheaterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheaterState] = useState<Theater | null>(
    null
  );

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theatersData = await getTheaters();
        setTheaters(theatersData);

        const savedTheaterId = localStorage.getItem("selectedTheaterId");
        if (savedTheaterId) {
          const theater = theatersData.find(
            (t) => t.id === parseInt(savedTheaterId)
          );
          if (theater) {
            setSelectedTheaterState(theater);
          } else if (theatersData.length > 0) {
            setSelectedTheaterState(theatersData[0]);
            localStorage.setItem(
              "selectedTheaterId",
              theatersData[0].id.toString()
            );
          }
        } else if (theatersData.length > 0) {
          setSelectedTheaterState(theatersData[0]);
          localStorage.setItem(
            "selectedTheaterId",
            theatersData[0].id.toString()
          );
        }
      } catch (error) {
        console.error("Error fetching theaters:", error);
      }
    };

    fetchTheaters();
  }, []);

  const setSelectedTheater = (theater: Theater) => {
    setSelectedTheaterState(theater);
    localStorage.setItem("selectedTheaterId", theater.id.toString());
  };

  return (
    <TheaterContext.Provider
      value={{
        selectedTheater,
        theaters,
        setSelectedTheater,
      }}>
      {children}
    </TheaterContext.Provider>
  );
};

export const useTheater = () => {
  const context = useContext(TheaterContext);
  if (!context) {
    throw new Error("useTheater must be used within a TheaterProvider");
  }
  return context;
};
