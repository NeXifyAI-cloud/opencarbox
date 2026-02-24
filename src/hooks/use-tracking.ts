'use client';

import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/events';
import { logger } from '@/lib/logger';

type FunnelStage = 'AWARENESS' | 'EDUCATION' | 'CONSIDERATION' | 'CONVERSION' | 'RETENTION';

export function useTracking() {
  const pathname = usePathname();

  const getDomainFromPath = (path: string): 'SHOP' | 'WERKSTATT' | 'AUTOHANDEL' | 'SHARED' => {
    if (path.startsWith('/shop')) return 'SHOP';
    if (path.startsWith('/werkstatt')) return 'WERKSTATT';
    if (path.startsWith('/autohandel')) return 'AUTOHANDEL';
    return 'SHARED';
  };

  const getFunnelStageFromPath = (path: string): FunnelStage => {
    if (path === '/shop' || path === '/werkstatt' || path === '/autohandel' || path === '/') return 'AWARENESS';
    if (path.includes('/kategorie') || path.includes('/leistungen')) return 'EDUCATION';
    if (path.includes('/produkt/') || path.includes('/fahrzeuge/')) return 'CONSIDERATION';
    if (path.includes('/checkout') || path.includes('/termin')) return 'CONVERSION';
    if (path.includes('/account') || path.includes('/garage')) return 'RETENTION';
    return 'AWARENESS';
  };

  const track = async (eventName: string, metadata?: Record<string, unknown>) => {
    const domain = getDomainFromPath(pathname);
    const funnel_stage = getFunnelStageFromPath(pathname);

    const baseEvent = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      funnel_stage,
      domain,
      metadata,
    };

    try {
      // Cast to any to allow dynamic event names in this helper
      await trackEvent({
        ...baseEvent,
        event_name: eventName,
      } as any);
    } catch (error) {
      logger.error('Tracking error', error);
    }
  };

  return { track };
}
