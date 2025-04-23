import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  size?: number;
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 40,
  position = "bottomRight",
  showText = true,
}) => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage and/or system preference
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

  // Apply theme styles when component mounts or theme changes
  useEffect(() => {
    // Create style element for global theme variables
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-styles';
    
    // CSS for both themes
    styleElement.textContent = `
      :root {
        /* Light theme defaults */
        --background-color: #ffffff;
        --text-color: #1E2429;
        --card-background: #f8f9fa;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        --border-color: #e0e0e0;
        --button-primary-bg: #4CAF50;
        --button-primary-text: white;
        --button-secondary-bg: #f0f0f0;
        --button-secondary-text: #333333;
        --input-bg: #ffffff;
        --input-border: #ddd;
        --action-btn-bg: #f0f0f0;
      }

      .dark-theme {
        /* Dark theme overrides */
        --background-color: #1a1a1a;
        --text-color: #f0f0f0;
        --card-background: #2d2d2d;
        --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        --border-color: #444;
        --button-primary-bg: #4CAF50;
        --button-primary-text: white;
        --button-secondary-bg: #3a3a3a;
        --button-secondary-text: #e0e0e0;
        --input-bg: #333333;
        --input-border: #555;
        --action-btn-bg: #2a2a2a;
      }

      body {
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Apply to common elements */
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

      .button-primary, .action-btn, .add-to-cart {
        background-color: var(--button-primary-bg);
        color: var(--button-primary-text);
      }

      .button-secondary, .category-tab, .showtime-btn {
        background-color: var(--button-secondary-bg);
        color: var(--button-secondary-text);
      }

      input, select, textarea {
        background-color: var(--input-bg);
        border-color: var(--input-border);
        color: var(--text-color);
      }
    `;

    // Add to document head
    document.head.appendChild(styleElement);

    // Apply theme class to root element
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Cleanup
    return () => {
      const existingStyle = document.getElementById('theme-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Position styles
  const positionStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1000,
    ...(position === 'bottomRight' && { bottom: '20px', right: '20px' }),
    ...(position === 'bottomLeft' && { bottom: '20px', left: '20px' }),
    ...(position === 'topRight' && { top: '20px', right: '20px' }),
    ...(position === 'topLeft' && { top: '20px', left: '20px' }),
  };

  // Button styles
  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    padding: showText ? '8px 16px' : '0',
    width: showText ? 'auto' : `${size}px`,
    height: `${size}px`,
    borderRadius: showText ? '20px' : '50%',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    color: isDark ? '#ffffff' : '#1E2429',
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: 500,
    fontSize: '14px',
  };

  return (
    <div style={positionStyles}>
      <button
        style={buttonStyles}
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <>
            <SunIcon size={size * 0.5} color="#4CAF50" />
            {showText && "Light Mode"}
          </>
        ) : (
          <>
            <MoonIcon size={size * 0.5} color="#1E2429" />
            {showText && "Dark Mode"}
          </>
        )}
      </button>
    </div>
  );
};

// SVG Icon Components
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