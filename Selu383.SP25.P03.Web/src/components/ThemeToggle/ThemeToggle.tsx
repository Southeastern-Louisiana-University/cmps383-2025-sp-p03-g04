import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  size?: number;
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 40,
  position = "bottomRight",
  showText = false,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark") {
      setIsDark(true);
    } else if (savedTheme === "light") {
      setIsDark(false);
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.id = "theme-styles";

    styleElement.textContent = `
      :root {
        --background-color: #ffffff;
        --text-color: #1E2429;
        --card-background: #f8f9fa;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        --button-primary-bg: #65a30d;
        --button-primary-text: white;
        --button-secondary-bg: #f0f0f0;
        --button-secondary-text: #333333;
        --input-bg: #ffffff;
        --input-border: #000000;
        --input-focus-border: #65a30d;
        --action-btn-bg: #f0f0f0;
        --movie-info-text: #000000;
        --theater-selector-bg: #ffffff;
      }

      .dark-theme {
        --background-color: #1a1a1a;
        --text-color: #f0f0f0;
        --card-background: #2d2d2d;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        --button-primary-bg: #65a30d;
        --button-primary-text: white;
        --button-secondary-bg: #3a3a3a;
        --button-secondary-text: #e0e0e0;
        --input-bg: #333333;
        --input-border: #555;
        --input-focus-border: #65a30d;
        --action-btn-bg: #2a2a2a;
        --movie-info-text: #f0f0f0;
        --theater-selector-bg: #000000;
      }

      body {
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Navbar background and text */
      .light-theme .navbar {
        background-color: #ffffff !important;
        transition: background-color 0.3s ease;
      }
      .dark-theme .navbar {
        background-color: #1a1a1a !important;
        transition: background-color 0.3s ease;
      }
      .light-theme .navbar,
      .light-theme .navbar a,
      .light-theme .navbar button,
      .light-theme .navbar span {
        color: #000000 !important;
      }
      .dark-theme .navbar,
      .dark-theme .navbar a,
      .dark-theme .navbar button,
      .dark-theme .navbar span {
        color: #f0f0f0 !important;
      }

      /* Theater selector background */
      .theater-selector-inner {
        background-color: var(--theater-selector-bg) !important;
        transition: background-color 0.3s ease;
      }

      /* Theater option text */
      .light-theme .theater-option {
        color: #000000 !important;
        transition: color 0.3s ease;
      }
      .dark-theme .theater-option {
        color: #f0f0f0 !important;
        transition: color 0.3s ease;
      }
      .light-theme .theater-option.active {
        color: #000000 !important;
      }
      .dark-theme .theater-option.active {
        color: #f0f0f0 !important;
      }

      /* Movie hero and showtimes section */
      .light-theme .movie-hero,
      .light-theme .showtimes-section {
        background-color: #ffffff !important;
      }
      .dark-theme .movie-hero,
      .dark-theme .showtimes-section {
        background-color: #1a1a1a !important;
      }

      /* Movie hero overlay */
      .light-theme .movie-hero-overlay {
        background: rgba(255, 255, 255, 0.5);
      }
      .dark-theme .movie-hero-overlay {
        background: rgba(0, 0, 0, 0.5);
      }

      /* Hero content text color */
      .light-theme .movie-hero-content,
      .light-theme .showtimes-section,
      .light-theme .showtimes-section h2,
      .light-theme .showtimes-section h3,
      .light-theme .showtimes-section p,
      .light-theme .showtimes-section span {
        color: #000000 !important;
      }
      .dark-theme .movie-hero-content,
      .dark-theme .showtimes-section,
      .dark-theme .showtimes-section h2,
      .dark-theme .showtimes-section h3,
      .dark-theme .showtimes-section p,
      .dark-theme .showtimes-section span {
        color: #f0f0f0 !important;
      }

      /* Movie card info text ("1h 56m · 2025") fix */
      .light-theme .movie-info {
        color: #000000 !important;
      }
      .dark-theme .movie-info {
        color: #f0f0f0 !important;
      }

      /* Cards and inputs */
      .card, .movie-card, .food-item-card {
        background-color: var(--card-background);
        box-shadow: var(--card-shadow);
        color: var(--text-color);
      }

      .search-input,
      .genre-filter select,
      .sort-filter select,
      input:not(.search-input),
      select,
      textarea {
        background-color: var(--input-bg);
        border-color: var(--input-border);
        color: var(--text-color);
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 16px;
        transition: all 0.3s ease;
      }

      .movie-info,
      .movie-card .movie-description,
      .movie-card p,
      .movie-card .description,
      .movie-card .card-text,
      .section-title,
      .movie-title,
      h1, h2, h3, h4, h5, h6 {
        color: var(--text-color);
      }

      .home-page, .movies-page, .concessions-page {
        background-color: var(--background-color);
        color: var(--text-color);
      }
    `;

    document.head.appendChild(styleElement);

    document.documentElement.classList.toggle("dark-theme", isDark);
    document.documentElement.classList.toggle("light-theme", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    return () => {
      const existingStyle = document.getElementById("theme-styles");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const positionStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 1000,
    ...(position === "bottomRight" && { bottom: "20px", right: "20px" }),
    ...(position === "bottomLeft" && { bottom: "20px", left: "20px" }),
    ...(position === "topRight" && { top: "20px", right: "20px" }),
    ...(position === "topLeft" && { top: "20px", left: "20px" }),
  };

  const buttonStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: showText ? "8px 16px" : "0",
    width: showText ? "auto" : `${size}px`,
    height: `${size}px`,
    borderRadius: showText ? "20px" : "50%",
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.15)",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    color: isDark ? "#ffffff" : "#1E2429",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
  };

  return (
    <div style={positionStyles}>
      <button
        style={buttonStyles}
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <SunIcon size={size * 0.5} color="#65a30d" />
        ) : (
          <MoonIcon size={size * 0.5} color="#1E2429" />
        )}
      </button>
    </div>
  );
};

const SunIcon = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default ThemeToggle;
