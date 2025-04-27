// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  
  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      setIsDark(prefersDark);
    }
  }, []);
  
  // Update document classes and localStorage whenever isDark changes
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-styles';

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

      /* Movie card info text ("1h 56m Â· 2025") fix */
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

    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    return () => {
      const existingStyle = document.getElementById('theme-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [isDark]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(prevState => !prevState);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
