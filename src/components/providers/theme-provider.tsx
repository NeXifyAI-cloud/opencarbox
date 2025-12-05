/**
 * Theme Provider - Dark Mode Support
 * 
 * Ermöglicht System/Light/Dark Theme-Umschaltung.
 * Nutzt next-themes für persistente Theme-Auswahl.
 * 
 * @module components/providers/theme-provider
 */

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

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

