'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { TrackingEvents, type TrackingEvent } from '@/lib/events';

/**
 * useTracking Hook
 * Zentraler Hook für Event-Tracking gemäß DOS v1.1.
 * Validiert Events gegen Zod-Schemas aus src/lib/events.ts.
 */
export function useTracking() {
  const pathname = usePathname();

  const track = useCallback((eventData: any) => {
    const eventName = eventData.event as keyof typeof TrackingEvents;
    const schema = TrackingEvents[eventName];

    if (!schema) {
      console.warn(`[Tracking] Unbekanntes Event: ${eventName}`);
      return;
    }

    // Automatisch Metadaten ergänzen
    const fullData = {
      ...eventData,
      page_path: pathname,
      timestamp: new Date().toISOString(),
    };

    const validation = schema.safeParse(fullData);

    if (!validation.success) {
      console.error(
        `[Tracking] Validierungsfehler für Event "${eventName}":`,
        validation.error.format()
      );
      return;
    }

    // In Produktion hier an Analytics-Provider (Vercel, GA4, etc.) senden
    console.log(`[Tracking] Event "${eventName}" erfolgreich validiert:`, validation.data);

    // Beispiel: window.dataLayer?.push(validation.data);
  }, [pathname]);

  return { track };
}
