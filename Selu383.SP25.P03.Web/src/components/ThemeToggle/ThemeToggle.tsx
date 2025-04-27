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
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

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
      }

      body {
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      .search-input {
        border: 1px solid var(--input-border) !important;
        background-color: var(--input-bg);
        color: var(--text-color);
        padding: 10px 15px;
        border-radius: 4px;
        width: 100%;
        font-size: 16px;
        transition: all 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
        border-color: var(--input-border) !important;
      }

      .genre-filter select, .sort-filter select {
        border: 1px solid var(--input-border) !important;
        background-color: var(--input-bg);
        color: var(--text-color);
        padding: 10px 15px;
        border-radius: 4px;
        width: 100%;
        font-size: 16px;
        transition: all 0.3s ease;
        appearance: none;
      }

      .genre-filter select:focus, .sort-filter select:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
        border-color: var(--input-focus-border) !important;
      }

      .movie-info {
        color: var(--movie-info-text) !important;
      }

      .movie-card .movie-description,
      .movie-card p,
      .movie-card .description,
      .movie-card .card-text {
        color: var(--movie-info-text) !important;
      }

      .home-page, .movies-page, .concessions-page {
        background-color: var(--background-color);
        color: var(--text-color);
      }

      .card, .movie-card, .food-item-card {
        background-color: var(--card-background);
        box-shadow: var(--card-shadow);
        color: var(--text-color);
      }

      .section-title, .movie-title, h1, h2, h3, h4, h5, h6 {
        color: var(--text-color);
      }

      /*  Fix: "Menu" black in light mode, white in dark mode */
      .light-theme .categories-menu h2 {
        color: #000000 !important;
      }
      .dark-theme .categories-menu h2 {
        color: #f0f0f0 !important;
      }

      /*  Fix: Food name and description black in light mode */
      .light-theme .food-item-card .food-name,
      .light-theme .food-item-card .food-description {
        color: #000000 !important;
      }

      /*  Food name and description light in dark mode */
      .dark-theme .food-item-card .food-name,
      .dark-theme .food-item-card .food-description {
        color: #f0f0f0 !important;
      }

      .button-primary, .action-btn, .add-to-cart {
        background-color: var(--button-primary-bg);
        color: var(--button-primary-text);
      }

      .button-secondary, .category-tab, .showtime-btn {
        background-color: var(--button-secondary-bg);
        color: var(--button-secondary-text);
      }

      input:not(.search-input), select, textarea {
        background-color: var(--input-bg);
        border-color: var(--input-border);
        color: var(--text-color);
      }

      .light-theme .theater-selection-container {
        background-color: #ffffff !important;
      }
      .dark-theme .theater-selection-container {
        background-color: #1a1a1a !important;
      }
        .light-theme .showtimes-section {
  background-color: #ffffff !important;
}
.dark-theme .showtimes-section {
  background-color: #1a1a1a !important;
}
  .light-theme .movie-hero {
  background-color: #ffffff !important;
}
.dark-theme .movie-hero {
  background-color: #1a1a1a !important;
}
  /*  Movie hero overlay adjustments */
.light-theme .movie-hero-overlay {
  background: rgba(255, 255, 255, 0.5); /* light transparent white overlay */
}

.dark-theme .movie-hero-overlay {
  background: rgba(0, 0, 0, 0.5); /* darker transparent black overlay */
}
/*  Movie hero info text color */
.light-theme .movie-hero-content,
.light-theme .movie-hero-content h1,
.light-theme .movie-hero-content h2,
.light-theme .movie-hero-content h3,
.light-theme .movie-hero-content p,
.light-theme .movie-hero-content span {
  color: #000000 !important;
}

.dark-theme .movie-hero-content,
.dark-theme .movie-hero-content h1,
.dark-theme .movie-hero-content h2,
.dark-theme .movie-hero-content h3,
.dark-theme .movie-hero-content p,
.dark-theme .movie-hero-content span {
  color: #f0f0f0 !important;
}
/* Showtimes section text color fix */
.light-theme .showtimes-section,
.light-theme .showtimes-section h2,
.light-theme .showtimes-section h3,
.light-theme .showtimes-section p,
.light-theme .showtimes-section button,
.light-theme .showtimes-section span {
  color: #000000 !important;
}

.dark-theme .showtimes-section,
.dark-theme .showtimes-section h2,
.dark-theme .showtimes-section h3,
.dark-theme .showtimes-section p,
.dark-theme .showtimes-section button,
.dark-theme .showtimes-section span {
  color: #f0f0f0 !important;
}
/*  HomePage No Showtimes Message Fix */
.light-theme .home-page .no-showtimes p {
  color: #000000 !important;
}

.dark-theme .home-page .no-showtimes p {
  color: #f0f0f0 !important;
}

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
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
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
    strokeLinejoin="round">
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
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default ThemeToggle;
