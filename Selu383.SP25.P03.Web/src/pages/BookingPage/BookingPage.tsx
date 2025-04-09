import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Showtime } from '../../types/Showtime';
import { Movie } from '../../types/Movie';
import { getShowtime } from '../../services/showtimeService';
import { getMovie } from '../../services/movieService';
import { getSeatsForShowtime } from '../../services/seatService';
import { createReservation } from '../../services/reservationService';
import { useCart } from '../../contexts/CartContext';
import { useTheater } from '../../contexts/TheaterContext';
import Footer from '../../components/Footer/Footer';
import { CartItem } from '../../types/CartItem';
import './BookingPage.css';

type SeatStatus = 'Available' | 'Selected' | 'Taken';

interface Seat {
  id: number;
  row: string;
  number: number;
  status: SeatStatus;
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTheater } = useTheater();
  
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<{ [key: string]: Seat[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<number, string>>({});
  
  const [ticketOptions] = useState([
    { type: 'Adult', multiplier: 1 },
    { type: 'Child', multiplier: 0.75 },
    { type: 'Senior', multiplier: 0.8 }
  ]);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const showtimeData = await getShowtime(parseInt(id));
        if (selectedTheater && showtimeData.theaterId !== selectedTheater.id) {
          setError('This showtime is not available at the selected theater.');
          return;
        }
        
        setShowtime(showtimeData);
        
        const movieData = await getMovie(showtimeData.movieId);
        setMovie(movieData);
        
        const seatingLayout = await getSeatsForShowtime(parseInt(id));
        
        const transformedSeats: { [key: string]: Seat[] } = {};
        Object.entries(seatingLayout.rows).forEach(([row, rowSeats]) => {
          transformedSeats[row] = rowSeats.map(seat => ({
            id: seat.id,
            row: seat.row,
            number: seat.number,
            status: seat.status as SeatStatus
          }));
        });
        
        setSeats(transformedSeats);
        
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, selectedTheater]);
  
  const toggleSeatSelection = (rowKey: string, seatIndex: number) => {
    const updatedSeats = { ...seats };
    const seat = updatedSeats[rowKey][seatIndex];
    
    if (seat.status !== 'Available') return;
    
    seat.status = seat.status === 'Available' ? 'Selected' : 'Available';
    setSeats(updatedSeats);
    
    if (seat.status === 'Selected') {
      setSelectedSeats(prevSeats => [...prevSeats, seat]);
      setTicketTypes(prevTicketTypes => ({ ...prevTicketTypes, [seat.id]: 'Adult' }));
    } else {
      setSelectedSeats(prevSeats => prevSeats.filter(s => s.id !== seat.id));
      setTicketTypes(prevTicketTypes => {
        const newTicketTypes = { ...prevTicketTypes };
        delete newTicketTypes[seat.id];
        return newTicketTypes;
      });
    }
  };

  // Function to change ticket type for a seat
  const changeTicketType = (seatId: number, ticketType: string) => {
    setTicketTypes(prevTicketTypes => ({ ...prevTicketTypes, [seatId]: ticketType }));
  };

  const calculateTotal = () => {
    if (!showtime) return '0.00';
    
    let total = 0;
    
    selectedSeats.forEach(seat => {
      const ticketType = ticketTypes[seat.id] || 'Adult';
      const ticketOption = ticketOptions.find(option => option.type === ticketType);
      
      if (ticketOption) {
        total += showtime.ticketPrice * ticketOption.multiplier;
      }
    });
    
    return total.toFixed(2);
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    
    if (!showtime || !movie) {
      alert('Booking information is incomplete.');
      return;
    }
    
    try {
      const reservationRequest = {
        showtimeId: showtime.id,
        tickets: selectedSeats.map(seat => ({
          seatId: seat.id,
          ticketType: ticketTypes[seat.id] || 'Adult'
        }))
      };
      
      const reservation = await createReservation(reservationRequest);
      
      selectedSeats.forEach(seat => {
        const ticketType = ticketTypes[seat.id] || 'Adult';
        const ticketOption = ticketOptions.find(option => option.type === ticketType);
        
        if (ticketOption && movie && showtime) {
          const cartItem: CartItem = {
            id: seat.id,
            name: `${movie.title} - Seat ${seat.row}${seat.number}`,
            price: showtime.ticketPrice * ticketOption.multiplier,
            quantity: 1,
            type: 'ticket',
            showtime: {
              id: showtime.id,
              movieId: movie.id,
              movieTitle: movie.title,
              startTime: showtime.startTime,
              screenName: showtime.screenName,
              theaterName: showtime.theaterName
            },
            seat: {
              id: seat.id,
              row: seat.row,
              number: seat.number
            },
            ticketType,
            showtimeId: 0,
            seatId: 0,
            seatLabel: ''
          };

          addToCart(cartItem);
        }
      });
      
      alert('Tickets reserved successfully!');
      navigate('/payment', { 
        state: { 
          reservationId: reservation.id, 
          total: parseFloat(calculateTotal()) 
        } 
      });
      
    } catch (error) {
      console.error('Reservation failed:', error);
      alert('Failed to create reservation. Please try again.');
    }
  };
  
  if (loading) {
    return <div className="loading-container">Loading booking information...</div>;
  }
  
  if (error || !showtime || !movie) {
    return <div className="error-container">{error || 'Booking information not found'}</div>;
  }
  
  return (
    <div className="booking-page">
      <div className="booking-header">
        <div className="movie-info">
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
      </div>
      
      <div className="seating-layout">
  {Object.entries(seats).map(([row, rowSeats]) => (
    <div key={row} className="row">
      <span className="row-label">{row}</span>
      <div className="seats">
        {rowSeats.map((seat, idx) => (
          <button
            key={seat.id}
            className={`seat ${seat.status === 'Available' ? 'available' : 
                          seat.status === 'Selected' ? 'selected' : 
                          seat.status === 'Taken' ? 'taken' : ''}`} 
            onClick={() => toggleSeatSelection(row, idx)}
          >
            {seat.number}
          </button>
        ))}
      </div>
    </div>
  ))}
</div>

      
      <div className="selected-seats">
        <h2>Selected Seats</h2>
        {selectedSeats.map(seat => (
          <div key={seat.id} className="selected-seat">
            <span>Seat {seat.row}{seat.number}</span>
            <select
              value={ticketTypes[seat.id] || 'Adult'}
              onChange={(e) => changeTicketType(seat.id, e.target.value)}
            >
              {ticketOptions.map(option => (
                <option key={option.type} value={option.type}>
                  {option.type}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout - Total: ${calculateTotal()}
        </button>
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;
