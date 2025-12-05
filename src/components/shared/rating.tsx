import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props für die Rating-Komponente
 */
interface RatingProps {
  /** Bewertung (0-5) */
  value: number;
  /** Maximale Sterne */
  max?: number;
  /** Größe der Sterne */
  size?: 'sm' | 'md' | 'lg';
  /** Anzahl der Bewertungen anzeigen */
  count?: number;
  /** Interaktiv (klickbar) */
  interactive?: boolean;
  /** Callback bei Änderung */
  onChange?: (value: number) => void;
  /** Nur Lesen (keine Hover-Effekte) */
  readOnly?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Größen-Mapping für Sterne
 */
const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * Rating-Komponente für Sternebewertungen.
 *
 * @example
 * // Anzeige-Modus
 * <Rating value={4.5} count={128} />
 *
 * @example
 * // Interaktiv
 * <Rating
 *   value={rating}
 *   onChange={setRating}
 *   interactive
 * />
 */
export function Rating({
  value,
  max = 5,
  size = 'md',
  count,
  interactive = false,
  onChange,
  readOnly = false,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  // Gerundeter Wert für Anzeige
  const displayValue = hoverValue ?? value;

  /**
   * Generiert Sterne basierend auf dem Wert
   */
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= max; i++) {
      const isFilled = displayValue >= i;
      const isHalf = !isFilled && displayValue >= i - 0.5;

      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive || readOnly}
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && !readOnly && setHoverValue(i)}
          onMouseLeave={() => interactive && !readOnly && setHoverValue(null)}
          className={cn(
            'relative',
            interactive && !readOnly && 'cursor-pointer',
            !interactive && 'cursor-default'
          )}
        >
          {/* Hintergrund-Stern (leer) */}
          <Star
            className={cn(
              sizeClasses[size],
              'text-muted-foreground/30'
            )}
          />

          {/* Gefüllter Stern (überlagert) */}
          {(isFilled || isHalf) && (
            <span
              className={cn(
                'absolute inset-0 overflow-hidden',
                isHalf && 'w-1/2'
              )}
            >
              {isHalf ? (
                <StarHalf
                  className={cn(
                    sizeClasses[size],
                    'fill-amber-400 text-amber-400'
                  )}
                />
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'fill-amber-400 text-amber-400'
                  )}
                />
              )}
            </span>
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Sterne */}
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>

      {/* Bewertungszahl */}
      <span className="ml-1 text-sm font-medium text-foreground">
        {value.toFixed(1)}
      </span>

      {/* Anzahl der Bewertungen */}
      {typeof count === 'number' && (
        <span className="text-sm text-muted-foreground">
          ({count.toLocaleString('de-AT')})
        </span>
      )}
    </div>
  );
}

/**
 * Kompakte Rating-Anzeige (nur Zahl und Stern)
 */
export function RatingCompact({
  value,
  count,
}: Pick<RatingProps, 'value' | 'count'>) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-medium">{value.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-xs text-muted-foreground">
          ({count})
        </span>
      )}
    </div>
  );
}

