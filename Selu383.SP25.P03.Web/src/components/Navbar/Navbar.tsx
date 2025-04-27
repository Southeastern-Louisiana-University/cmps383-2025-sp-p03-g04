import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import TypewriterBanner from '../TypewriterBanner/TypewriterBanner';
import Cart from '../Cart/Cart';
import './Navbar.css';

// Services
import { getTheaters } from '../../services/theaterService';

// Types
import { Theater } from '../../types/Theater';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const location = useLocation();

  // Fetch theaters on component mount
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theatersData = await getTheaters();
        setTheaters(theatersData);
        
        // Check if there's a saved theater in localStorage
        const savedTheaterId = localStorage.getItem('selectedTheaterId');
        if (savedTheaterId) {
          const theater = theatersData.find(t => t.id === parseInt(savedTheaterId));
          if (theater) {
            setSelectedTheater(theater);
          } else if (theatersData.length > 0) {
            // Fallback to first theater if saved theater not found
            setSelectedTheater(theatersData[0]);
            localStorage.setItem('selectedTheaterId', theatersData[0].id.toString());
          }
        } else if (theatersData.length > 0) {
          // Default to first theater if no saved theater
          setSelectedTheater(theatersData[0]);
          localStorage.setItem('selectedTheaterId', theatersData[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    };

    fetchTheaters();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle theater selection
  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
    localStorage.setItem('selectedTheaterId', theater.id.toString());
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <TypewriterBanner />
        </Link>
      </div>
      <div className="primary-menu">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>
      </div>

        {/* Cart component */}
        <Cart />
        <button className="sign-in">SIGN IN</button>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>
        {/* Theater Dropdown for Mobile */}
        <div className="mobile-theater-dropdown">
          <span>Select Theater:</span>
          <select 
            value={selectedTheater?.id || ''}
            onChange={(e) => {
              const theater = theaters.find(t => t.id === parseInt(e.target.value));
              if (theater) {
                handleTheaterSelect(theater);
              }
            }}
          >
            {theaters.map(theater => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;