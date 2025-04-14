// Global color palette
export const Colors = {
  light: {
    // Base colors
    text: "#242424",
    background: "#FFFFFF",
    card: "#F5F5F5",
    border: "#DDDDDD",

    // Brand colors
    primary: "#B4D335", // Lion's Den green
    primaryDark: "#93AD2B",
    secondary: "#1E3A55", // Dark blue
    secondaryDark: "#172B40",

    // UI colors
    tint: "#B4D335", // Used for active states, highlights
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#B4D335",

    // Status colors
    success: "#4CD964",
    warning: "#FFCC00",
    danger: "#E74C3C",
    info: "#5AC8FA",

    // Grayscale
    gray1: "#F5F5F5",
    gray2: "#EEEEEE",
    gray3: "#DDDDDD",
    gray4: "#BBBBBB",
    gray5: "#999999",
    gray6: "#666666",
    gray7: "#333333",
    gray8: "#222222",
  },
  dark: {
    // Base colors
    text: "#ECEDEE",
    background: "#121212",
    card: "#1E1E1E",
    border: "#333333",

    // Brand colors
    primary: "#B4D335", // Lion's Den green - keep consistent
    primaryDark: "#93AD2B",
    secondary: "#1E3A55", // Dark blue
    secondaryDark: "#172B40",

    // UI colors
    tint: "#B4D335", // Used for active states, highlights
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#B4D335",

    // Status colors
    success: "#4CD964",
    warning: "#FFCC00",
    danger: "#E74C3C",
    info: "#5AC8FA",

    // Grayscale
    gray1: "#222222",
    gray2: "#2A2A2A",
    gray3: "#333333",
    gray4: "#666666",
    gray5: "#999999",
    gray6: "#BBBBBB",
    gray7: "#DDDDDD",
    gray8: "#EEEEEE",

    // Theater mode - ultra dark for movie watching
    theaterBackground: "#000000",
    theaterText: "#BBBBBB",
    theaterIcon: "#666666",
  },
};

// Named colors for specific UI elements
export const UIColors = {
  // Common colors that work in both light and dark
  brandGreen: "#B4D335", // Lion's Den signature green

  // Light mode colors
  light: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#242424",
    textSecondary: "#666666",
    border: "#DDDDDD",
    buttonText: "#242424",
    navBar: "#FFFFFF",
    tabBar: "#FFFFFF",
    card: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.1)",
  },

  // Dark mode colors
  dark: {
    background: "#121212",
    surface: "#1E2429",
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    border: "#333333",
    buttonText: "#242424", // Keep dark text on green buttons
    navBar: "#1E2429",
    tabBar: "#1E2429",
    card: "#262D33",
    shadow: "rgba(0, 0, 0, 0.5)",
  },

  // UI components - values will be selected based on theme
  header: "#B4D335",
  seatAvailable: "#1E3A55",
  seatSelected: "#B4D335",
  seatUnavailable: "#666666",
  bookButton: "#B4D335",
};

// Theater mode theme - for when in a movie
export const TheaterMode = {
  background: "#000000",
  text: "#BBBBBB",
  dimText: "#666666",
  accent: "#B4D335",
  icon: "#666666",
  modal: "#1A1A1A",
  button: "#333333",
};
