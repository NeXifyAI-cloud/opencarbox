/**
 * Root Provider
 * 
 * Kombiniert alle Provider in der richtigen Reihenfolge.
 * Zentrale Provider-Konfiguration für die gesamte App.
 * 
 * @module components/providers
 */

'use client';

import * as React from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { ToastProvider } from './toast-provider';

/**
 * Root Provider Props
 */
interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root Provider Komponente
 * 
 * Wraps die gesamte Anwendung mit allen notwendigen Providern:
 * 1. ThemeProvider (außen) - Theme-Kontext
 * 2. QueryProvider - TanStack Query
 * 3. ToastProvider (innen) - Benachrichtigungen
 * 
 * Die Reihenfolge ist wichtig für Dependencies:
 * - Toast benötigt Theme-Kontext
 * - Query ist unabhängig
 * 
 * @example
 * ```tsx
 * // In layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

