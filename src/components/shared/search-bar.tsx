'use client';

import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';
import { Car, Search, X } from 'lucide-react';
import * as React from 'react';

/**
 * Props für die SearchBar-Komponente
 */
interface SearchBarProps {
  /** Platzhalter-Text */
  placeholder?: string;
  /** Callback bei Suche */
  onSearch?: (query: string) => void;
  /** Callback bei HSN/TSN Suche */
  onHsnTsnSearch?: (hsn: string, tsn: string) => void;
  /** HSN/TSN Modus anzeigen */
  showHsnTsn?: boolean;
  /** Initaler Suchwert */
  defaultValue?: string;
  /** Größe der Suchleiste */
  size?: 'sm' | 'md' | 'lg';
  /** Variante (Marke) */
  variant?: 'default' | 'carvantooo' | 'opencarbox';
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Automatische Suche bei Eingabe (mit Debounce) */
  autoSearch?: boolean;
  /** Debounce-Zeit in ms */
  debounceMs?: number;
}

/**
 * Größen-Mapping für SearchBar
 */
const sizeClasses = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
};

/**
 * Varianten-Mapping für SearchBar
 */
const variantClasses = {
  default: 'focus-within:ring-ring',
  carvantooo: 'focus-within:ring-carvantooo-500',
  opencarbox: 'focus-within:ring-opencarbox-500',
};

/**
 * SearchBar-Komponente für Produktsuche und HSN/TSN-Eingabe.
 *
 * @example
 * // Einfache Suche
 * <SearchBar
 *   placeholder="Suche nach Ersatzteilen..."
 *   onSearch={() => {}}
 * />
 *
 * @example
 * // Mit HSN/TSN Modus
 * <SearchBar
 *   showHsnTsn
 *   onHsnTsnSearch={(hsn, tsn) => lookupVehicle(hsn, tsn)}
 *   variant="carvantooo"
 * />
 */
export function SearchBar({
  placeholder = 'Suche...',
  onSearch,
  onHsnTsnSearch,
  showHsnTsn = false,
  defaultValue = '',
  size = 'md',
  variant = 'default',
  className,
  autoSearch = false,
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = React.useState(defaultValue);
  const [isHsnMode, setIsHsnMode] = React.useState(false);
  const [hsn, setHsn] = React.useState('');
  const [tsn, setTsn] = React.useState('');

  // Debounced Wert für Auto-Suche
  const debouncedQuery = useDebounce(query, debounceMs);

  // Auto-Suche bei Eingabe
  React.useEffect(() => {
    if (autoSearch && debouncedQuery && onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, autoSearch, onSearch]);

  /**
   * Textsuche ausführen
   */
  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  /**
   * HSN/TSN Suche ausführen
   */
  const handleHsnTsnSearch = () => {
    if (hsn && tsn && onHsnTsnSearch) {
      onHsnTsnSearch(hsn, tsn);
    }
  };

  /**
   * Enter-Taste behandeln
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isHsnMode) {
        handleHsnTsnSearch();
      } else {
        handleSearch();
      }
    }
  };

  /**
   * Eingabe leeren
   */
  const handleClear = () => {
    setQuery('');
    setHsn('');
    setTsn('');
  };

  return (
    <div
      className={cn(
        'relative flex items-center rounded-lg border bg-background',
        'transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-offset-2',
        variantClasses[variant],
        className
      )}
    >
      {/* HSN/TSN Toggle Button */}
      {showHsnTsn && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsHsnMode(!isHsnMode)}
          className={cn(
            'ml-1 shrink-0',
            isHsnMode && 'bg-muted'
          )}
          title={isHsnMode ? 'Zur Textsuche wechseln' : 'HSN/TSN Suche'}
        >
          <Car className="h-4 w-4" />
        </Button>
      )}

      {/* Such-Icon */}
      {!showHsnTsn && (
        <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
      )}

      {/* Eingabefelder */}
      {isHsnMode ? (
        // HSN/TSN Eingabe
        <div className="flex flex-1 items-center gap-2 px-2">
          <input
            type="text"
            value={hsn}
            onChange={(e) => setHsn(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="HSN (4-stellig)"
            maxLength={4}
            className={cn(
              'w-20 border-0 bg-transparent outline-none',
              'placeholder:text-muted-foreground',
              sizeClasses[size]
            )}
          />
          <span className="text-muted-foreground">/</span>
          <input
            type="text"
            value={tsn}
            onChange={(e) => setTsn(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="TSN (3-stellig)"
            maxLength={3}
            className={cn(
              'w-20 border-0 bg-transparent outline-none',
              'placeholder:text-muted-foreground',
              sizeClasses[size]
            )}
          />
        </div>
      ) : (
        // Textsuche
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'flex-1 border-0 bg-transparent px-3 outline-none',
            'placeholder:text-muted-foreground',
            sizeClasses[size]
          )}
        />
      )}

      {/* Clear Button */}
      {(query || hsn || tsn) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="mr-1 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Such-Button */}
      <Button
        type="button"
        variant={variant === 'carvantooo' ? 'gradient-primary' : variant === 'opencarbox' ? 'gradient-secondary' : 'secondary'}
        size={size}
        onClick={isHsnMode ? handleHsnTsnSearch : handleSearch}
        className="m-1 shrink-0"
      >
        <Search className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Suchen</span>
      </Button>
    </div>
  );
}
