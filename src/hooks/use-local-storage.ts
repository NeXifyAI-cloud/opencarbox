import { useState, useEffect, useCallback } from 'react';

/**
 * Speichert und synchronisiert einen Wert mit localStorage.
 * Unterstützt SSR (gibt initialValue zurück auf dem Server).
 *
 * @param key - Der localStorage-Schlüssel
 * @param initialValue - Standardwert, falls kein gespeicherter Wert existiert
 * @returns [value, setValue, removeValue] - Wert, Setter und Remove-Funktion
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 * setTheme('dark'); // Speichert automatisch in localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Initialer Wert aus localStorage oder initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // Bei Fehler (z.B. ungültiges JSON) Standardwert verwenden
      return initialValue;
    }
  });

  // Setter, der localStorage aktualisiert
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Erlaubt eine Funktion als Wert (wie useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Fehler still ignorieren (localStorage könnte voll sein)
      }
    },
    [key, storedValue]
  );

  // Entfernt den Wert aus localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // Fehler still ignorieren
    }
  }, [key, initialValue]);

  // Synchronisiere mit anderen Tabs/Fenstern
  useEffect(() => {
    // SSR-Guard: Event Listener nur im Browser registrieren
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        // Bug 1 Fix: Auch Löschungen synchronisieren (e.newValue === null)
        if (e.newValue === null) {
          // Item wurde in anderem Tab gelöscht -> auf initialValue zurücksetzen
          setStoredValue(initialValue);
        } else {
          try {
            setStoredValue(JSON.parse(e.newValue) as T);
          } catch {
            // Ungültiges JSON ignorieren
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
