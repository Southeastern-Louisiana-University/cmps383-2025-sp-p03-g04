import { useEffect, useState } from "react";
import { ColorSchemeName } from "./useColorScheme";

export function useColorScheme(): ColorSchemeName {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>("light");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setColorScheme(mediaQuery.matches ? "dark" : "light");

    const listener = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  if (!hasHydrated) {
    return "light";
  }

  return colorScheme;
}
