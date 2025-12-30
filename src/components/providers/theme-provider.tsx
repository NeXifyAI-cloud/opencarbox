/**
 * Theme Provider - Dark Mode Support
 *
 * Ermöglicht System/Light/Dark Theme-Umschaltung.
 * Nutzt next-themes für persistente Theme-Auswahl.
 *
 * @module components/providers/theme-provider
 */

'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from 'next-themes';
import * as React from 'react';

/** Theme Provider Props Interface */
type ThemeProviderProps = NextThemeProviderProps & {
  children: React.ReactNode;
}

/**
 * Theme Provider Komponente
 *
 * Wrapper für next-themes ThemeProvider mit optimierten Einstellungen.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
