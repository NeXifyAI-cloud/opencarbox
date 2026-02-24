'use client';

import { useEffect } from 'react';
import { useTracking } from '@/hooks/use-tracking';

export function PageTracker() {
  const { track } = useTracking();

  useEffect(() => {
    track('page_view');
  }, []);

  return null;
}
