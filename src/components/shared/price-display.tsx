import * as React from 'react';
import { cn, formatPrice as formatPriceUtil } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

/**
 * Props für die PriceDisplay-Komponente
 */
interface PriceDisplayProps {
  /** Aktueller Preis in Euro */
  price: number;
  /** Ursprünglicher Preis (für Rabatt-Anzeige) */
  originalPrice?: number;
  /** Währung */
  currency?: 'EUR' | 'CHF';
  /** Größe der Preisanzeige */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Layout (horizontal oder vertikal) */
  layout?: 'horizontal' | 'vertical';
  /** Rabatt-Badge anzeigen */
  showDiscount?: boolean;
  /** "Ab"-Präfix anzeigen (für variable Preise) */
  showFrom?: boolean;
  /** MwSt-Hinweis anzeigen */
  showVat?: boolean;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Größen-Mapping für Preis
 */
const sizeClasses = {
  sm: {
    price: 'text-base font-semibold',
    original: 'text-xs',
    discount: 'text-xs',
  },
  md: {
    price: 'text-xl font-bold',
    original: 'text-sm',
    discount: 'text-sm',
  },
  lg: {
    price: 'text-2xl font-bold',
    original: 'text-base',
    discount: 'text-base',
  },
  xl: {
    price: 'text-4xl font-bold',
    original: 'text-lg',
    discount: 'text-lg',
  },
};

/**
 * Formatiert einen Preis in Euro oder CHF unter Verwendung der zentralen Utility
 */
function formatPrice(price: number, currency: 'EUR' | 'CHF'): string {
  return formatPriceUtil(price, currency);
}

/**
 * Berechnet den Rabatt-Prozentsatz
 */
function calculateDiscount(original: number, current: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * PriceDisplay-Komponente für Preisanzeigen mit optionalem Rabatt.
 *
 * @example
 * // Einfache Preisanzeige
 * <PriceDisplay price={49.99} />
 *
 * @example
 * // Mit Rabatt
 * <PriceDisplay
 *   price={39.99}
 *   originalPrice={59.99}
 *   showDiscount
 *   size="lg"
 * />
 *
 * @example
 * // "Ab"-Preis
 * <PriceDisplay price={29.99} showFrom />
 */
export function PriceDisplay({
  price,
  originalPrice,
  currency = 'EUR',
  size = 'md',
  layout = 'horizontal',
  showDiscount = true,
  showFrom = false,
  showVat = false,
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? calculateDiscount(originalPrice, price)
    : 0;

  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex items-baseline gap-2',
        layout === 'vertical' && 'flex-col items-start gap-1',
        className
      )}
    >
      {/* Rabatt-Badge */}
      {hasDiscount && showDiscount && (
        <Badge variant="destructive" className={styles.discount}>
          -{discountPercent}%
        </Badge>
      )}

      {/* Preisbereich */}
      <div className={cn(
        'flex items-baseline gap-2',
        layout === 'vertical' && 'flex-row'
      )}>
        {/* "Ab" Präfix */}
        {showFrom && (
          <span className="text-muted-foreground text-sm">ab</span>
        )}

        {/* Aktueller Preis */}
        <span className={cn(styles.price, 'text-foreground')}>
          {formatPrice(price, currency)}
        </span>

        {/* Ursprünglicher Preis (durchgestrichen) */}
        {hasDiscount && (
          <span
            className={cn(
              styles.original,
              'text-muted-foreground line-through'
            )}
          >
            {formatPrice(originalPrice, currency)}
          </span>
        )}
      </div>

      {/* MwSt-Hinweis */}
      {showVat && (
        <span className="text-xs text-muted-foreground">
          inkl. MwSt.
        </span>
      )}
    </div>
  );
}

/**
 * Kompakte Preisanzeige für Listen
 */
export function PriceCompact({
  price,
  originalPrice,
  currency = 'EUR',
}: Pick<PriceDisplayProps, 'price' | 'originalPrice' | 'currency'>) {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-semibold text-foreground">
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(originalPrice, currency)}
        </span>
      )}
    </div>
  );
}

