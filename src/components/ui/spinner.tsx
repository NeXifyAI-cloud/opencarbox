import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props für die Spinner-Komponente
 */
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Größe des Spinners */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Farb-Variante */
  variant?: 'default' | 'carvantooo' | 'opencarbox' | 'white';
}

/**
 * Größen-Mapping für Spinner
 */
const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

/**
 * Farb-Mapping für Spinner
 */
const variantClasses = {
  default: 'border-muted-foreground/30 border-t-muted-foreground',
  carvantooo: 'border-carvantooo-200 border-t-carvantooo-500',
  opencarbox: 'border-opencarbox-200 border-t-opencarbox-500',
  white: 'border-white/30 border-t-white',
};

/**
 * Spinner/Loading-Indikator-Komponente.
 *
 * @example
 * <Spinner />
 * <Spinner size="lg" variant="carvantooo" />
 *
 * @example
 * // Auf Button
 * <Button disabled>
 *   <Spinner size="sm" variant="white" className="mr-2" />
 *   Laden...
 * </Button>
 */
function Spinner({
  size = 'md',
  variant = 'default',
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Laden..."
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Laden...</span>
    </div>
  );
}

/**
 * Ganzseiten-Loading-Komponente
 *
 * @example
 * if (isLoading) return <PageSpinner />;
 */
function PageSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Spinner size="xl" variant="carvantooo" />
    </div>
  );
}

/**
 * Overlay-Loading-Komponente (überlagert Inhalt)
 *
 * @example
 * <div className="relative">
 *   <Content />
 *   {isLoading && <LoadingOverlay />}
 * </div>
 */
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner size="lg" variant="carvantooo" />
    </div>
  );
}

export { Spinner, PageSpinner, LoadingOverlay };

