import { useState, useEffect } from 'react';

/**
 * Gibt zurück, ob die Komponente gemountet ist.
 * Nützlich für SSR/Hydration-Probleme bei Client-only Inhalten.
 *
 * @returns true wenn die Komponente auf dem Client gemountet ist
 *
 * @example
 * const isMounted = useMounted();
 *
 * // Verhindert Hydration-Mismatch
 * if (!isMounted) {
 *   return <Skeleton />;
 * }
 *
 * return <ClientOnlyComponent />;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

