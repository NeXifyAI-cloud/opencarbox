import { cn } from '@/lib/utils';

/**
 * Props für die Skeleton-Komponente
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Breite (CSS-Wert) */
  width?: string;
  /** Höhe (CSS-Wert) */
  height?: string;
}

/**
 * Skeleton-Komponente für Lade-Platzhalter.
 * Animiert einen schimmernden Effekt.
 *
 * @example
 * // Einfacher Skeleton
 * <Skeleton className="h-4 w-[250px]" />
 *
 * @example
 * // Kreisförmig (Avatar)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * @example
 * // Mit expliziten Dimensionen
 * <Skeleton width="100%" height="200px" />
 */
function Skeleton({
  className,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Skeleton für eine Textzeile
 */
function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            // Letzte Zeile kürzer für natürlicheres Aussehen
            i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton für einen Avatar
 */
function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
}

/**
 * Skeleton für eine Card
 */
function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4">
      {/* Bild-Placeholder */}
      <Skeleton className="mb-4 h-40 w-full rounded-lg" />

      {/* Titel */}
      <Skeleton className="mb-2 h-5 w-3/4" />

      {/* Text */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Button */}
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}

/**
 * Skeleton für Produkt-Card
 */
function SkeletonProductCard() {
  return (
    <div className="rounded-xl border p-4">
      {/* Bild */}
      <Skeleton className="mb-4 aspect-square w-full rounded-lg" />

      {/* Badge */}
      <Skeleton className="mb-2 h-5 w-16" />

      {/* Titel */}
      <Skeleton className="mb-1 h-5 w-full" />
      <Skeleton className="mb-3 h-5 w-2/3" />

      {/* Preis */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton für eine Tabellen-Zeile
 */
function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 / columns}%` }}
        />
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonProductCard,
  SkeletonTableRow,
};

