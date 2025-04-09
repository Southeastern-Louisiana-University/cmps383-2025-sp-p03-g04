import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
  } from 'react';
  import { getTheaters } from '../services/theaterService';
  import { Theater } from '../types/Theater';
  
  // Create the context type
  interface TheaterContextType {
    selectedTheater: Theater | null;
    theaters: Theater[];
    setSelectedTheater: (theater: Theater) => void;
  }
  
  // Create the context
  const TheaterContext = createContext<TheaterContextType>({
    selectedTheater: null,
    theaters: [],
    setSelectedTheater: () => {}
  });
  
  // Provider component
  export const TheaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [selectedTheater, setSelectedTheaterState] = useState<Theater | null>(null);
  
    // Fetch theaters on mount
    useEffect(() => {
      const fetchTheaters = async () => {
        try {
          const theatersData = await getTheaters();
          setTheaters(theatersData);
          
          // Check localStorage for saved theater
          const savedTheaterId = localStorage.getItem('selectedTheaterId');
          if (savedTheaterId) {
            const theater = theatersData.find(t => t.id === parseInt(savedTheaterId));
            if (theater) {
              setSelectedTheaterState(theater);
            } else if (theatersData.length > 0) {
              // Fallback to first theater if saved theater not found
              setSelectedTheaterState(theatersData[0]);
              localStorage.setItem('selectedTheaterId', theatersData[0].id.toString());
            }
          } else if (theatersData.length > 0) {
            // Default to first theater
            setSelectedTheaterState(theatersData[0]);
            localStorage.setItem('selectedTheaterId', theatersData[0].id.toString());
          }
        } catch (error) {
          console.error('Error fetching theaters:', error);
        }
      };
  
      fetchTheaters();
    }, []);
  
    // Wrapper for setSelectedTheater to also update localStorage
    const setSelectedTheater = (theater: Theater) => {
      setSelectedTheaterState(theater);
      localStorage.setItem('selectedTheaterId', theater.id.toString());
    };
  
    return (
      <TheaterContext.Provider value={{ 
        selectedTheater, 
        theaters, 
        setSelectedTheater 
      }}>
        {children}
      </TheaterContext.Provider>
    );
  };
  
  // Custom hook to use the theater context
  export const useTheater = () => {
    const context = useContext(TheaterContext);
    if (!context) {
      throw new Error('useTheater must be used within a TheaterProvider');
    }
    return context;
  };