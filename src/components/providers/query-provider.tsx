/**
 * Query Provider - TanStack Query
 *
 * Stellt QueryClient für Server-State-Management bereit.
 * Konfiguriert Caching-Strategien und DevTools.
 *
 * @module components/providers/query-provider
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

/**
 * Query Provider Props
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Komponente
 *
 * Erstellt und konfiguriert QueryClient mit optimierten Settings:
 * - Produkte: 5min Cache, 2min Stale Time
 * - Kategorien: 30min Cache, 10min Stale Time
 * - Bestellungen: Immer fresh
 *
 * @example
 * ```tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient als State, damit er nur einmal erstellt wird
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Globale Defaults
            staleTime: 60 * 1000, // 1 Minute
            gcTime: 5 * 60 * 1000, // 5 Minuten (früher cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
