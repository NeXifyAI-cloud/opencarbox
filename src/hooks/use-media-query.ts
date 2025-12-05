import { useState, useEffect } from 'react';

/**
 * Prüft, ob eine CSS Media Query zutrifft.
 * Aktualisiert sich automatisch bei Fenstergrößenänderungen.
 *
 * @param query - Die Media Query (z.B. '(min-width: 768px)')
 * @returns true wenn die Query zutrifft, false sonst
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * const isMobile = useMediaQuery('(max-width: 639px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Auf dem Server false zurückgeben
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Initial prüfen
    setMatches(mediaQuery.matches);

    // Listener für Änderungen
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Moderne Browser verwenden addEventListener
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Vordefinierte Breakpoints basierend auf Tailwind CSS.
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

/**
 * Prüft, ob der Viewport mindestens die angegebene Breakpoint-Größe hat.
 *
 * @param breakpoint - Der zu prüfende Breakpoint
 * @returns true wenn der Breakpoint erreicht ist
 *
 * @example
 * const isLargeScreen = useBreakpoint('lg');
 */
export function useBreakpoint(
  breakpoint: keyof typeof breakpoints
): boolean {
  return useMediaQuery(breakpoints[breakpoint]);
}

