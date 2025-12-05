/**
 * Toast Provider - Benachrichtigungen
 * 
 * Stellt globales Toast-System für Benachrichtigungen bereit.
 * Nutzt Sonner für moderne, accessible Toasts.
 * 
 * @module components/providers/toast-provider
 */

'use client';

import * as React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast Provider Komponente
 * 
 * Rendert Sonner Toaster mit Theme-aware Konfiguration.
 * 
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * 
 * // Verwendung in Komponenten:
 * import { toast } from 'sonner';
 * 
 * toast.success('Artikel zum Warenkorb hinzugefügt');
 * toast.error('Fehler beim Laden');
 * toast.info('Termin gebucht');
 * ```
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme as 'light' | 'dark' | 'system'}
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'font-body',
            title: 'font-semibold',
            description: 'text-sm',
            actionButton: 'bg-carvantooo-500 text-white',
            cancelButton: 'bg-slate-200',
            error: 'bg-error-50 text-error-700 border-error-500',
            success: 'bg-success-50 text-success-700 border-success-500',
            warning: 'bg-warning-50 text-warning-700 border-warning-500',
            info: 'bg-info-50 text-info-700 border-info-500',
          },
        }}
        richColors
        closeButton
        duration={4000}
      />
    </>
  );
}

