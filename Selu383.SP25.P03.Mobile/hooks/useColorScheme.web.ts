import { useEffect, useState } from 'react';
import { ColorSchemeName } from './useColorScheme';

/**
 * Web-specific implementation of useColorScheme.
 * This detects the user's preferred color scheme via CSS media query.
 * We use a hydration check to ensure consistent rendering between server and client.
 */
export function useColorScheme(): ColorSchemeName {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render
    setHasHydrated(true);

    // Check if user prefers dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial value
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', listener);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  // During server rendering or first client render, return a default
  if (!hasHydrated) {
    return 'light';
  }

  return colorScheme;
}