// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import TypewriterBanner from '../TypewriterBanner/TypewriterBanner';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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
        <NavLink to="/coming-soon">Coming Soon</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>
        <NavLink to="/theaters">Theaters</NavLink>
      </div>
      
      <div className="navbar-right">
        <button className="theater-mode">THEATER MODE</button>
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
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/coming-soon">Coming Soon</NavLink>
        <NavLink to="/concessions">Concessions</NavLink>
        <NavLink to="/theaters">Theaters</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;