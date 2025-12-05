import { useState, useEffect } from 'react';

/**
 * Verzögert einen Wert um eine bestimmte Zeit.
 * Nützlich für Sucheingaben, um API-Aufrufe zu reduzieren.
 *
 * @param value - Der zu verzögernde Wert
 * @param delay - Verzögerung in Millisekunden (Standard: 500ms)
 * @returns Der verzögerte Wert
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // API-Aufruf nur wenn debouncedSearch sich ändert
 *   searchProducts(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Timer starten
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Timer bei Änderung des Wertes oder Unmount aufräumen
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

