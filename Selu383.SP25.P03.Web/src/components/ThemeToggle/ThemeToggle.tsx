import React from "react";
import { useTheme } from "../../contexts/Themecontext";

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
  const { isDark, toggleTheme } = useTheme();

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
        {showText && (isDark ? "Light Mode" : "Dark Mode")}
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
