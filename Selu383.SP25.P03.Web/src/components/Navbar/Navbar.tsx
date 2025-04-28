import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import TypewriterBanner from "../TypewriterBanner/TypewriterBanner";
import Cart from "../Cart/Cart";
import { useTheme } from "../../contexts/Themecontext";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

import { getTheaters } from "../../services/theaterService";

import { Theater } from "../../types/Theater";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

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
            setSelectedTheater(theater);
          } else if (theatersData.length > 0) {
            // Fallback to first theater if no damn theatre
            setSelectedTheater(theatersData[0]);
            localStorage.setItem(
              "selectedTheaterId",
              theatersData[0].id.toString()
            );
          }
        } else if (theatersData.length > 0) {
          setSelectedTheater(theatersData[0]);
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

  useEffect(() => {
    setMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTheaterSelect = (theater: Theater) => {
    if (!selectedTheater || selectedTheater.id !== theater.id) {
      setSelectedTheater(theater);
      localStorage.setItem("selectedTheaterId", theater.id.toString());
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <TypewriterBanner />
        </Link>
      </div>
      <div className="primary-menu">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          {isDark ? (
            <span className="theme-icon">☀️</span>
          ) : (
            <span className="theme-icon">🌙</span>
          )}
        </button>

        <Cart />

        {isAuthenticated ? (
          <div className="user-menu-container">
            <button
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}>
              <i className="fas fa-user"></i>
              {user?.username}
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <NavLink to="/profile" onClick={() => setShowUserMenu(false)}>
                  <i className="fas fa-user-circle"></i>
                  Profile
                </NavLink>
                <button onClick={handleSignOut}>
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-in" onClick={() => navigate("/signin")}>
            SIGN IN
          </button>
        )}

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>

        <div className="mobile-theater-dropdown">
          <span>Select Theater:</span>
          <select
            value={selectedTheater?.id || ""}
            onChange={(e) => {
              const theater = theaters.find(
                (t) => t.id === parseInt(e.target.value)
              );
              if (theater) {
                handleTheaterSelect(theater);
              }
            }}>
            {theaters.map((theater) => (
              <option key={theater.id} value={theater.id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        {isAuthenticated ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <button className="mobile-sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/signin">Sign In</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
