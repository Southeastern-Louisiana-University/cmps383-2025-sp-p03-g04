import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <i className="movie-icon">🎬</i> Lion's Den
        </div>
      </div>
      <div className="copyright">
        <p>© {currentYear} Lion's Den Cinemas. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
