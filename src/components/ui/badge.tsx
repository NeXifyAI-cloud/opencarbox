import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge-Varianten Definition
 */
const badgeVariants = cva(
  // Base Styles
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        /** Standard Badge */
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        /** Sekundäres Badge */
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        /** Destruktives/Fehler Badge */
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        /** Outline Badge */
        outline: 'text-foreground',
        /** Erfolgs-Badge */
        success:
          'border-transparent bg-emerald-500 text-white hover:bg-emerald-600',
        /** Warnungs-Badge */
        warning:
          'border-transparent bg-amber-500 text-white hover:bg-amber-600',
        /** Info-Badge */
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        /** Carvantooo (Shop) Badge */
        carvantooo:
          'border-transparent bg-carvantooo-500 text-white hover:bg-carvantooo-600',
        /** OpenCarBox (Services) Badge */
        opencarbox:
          'border-transparent bg-opencarbox-500 text-white hover:bg-opencarbox-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Props für die Badge-Komponente
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optionales Icon links */
  icon?: React.ReactNode;
}

/**
 * Badge-Komponente für Status-Anzeigen und Kategorien.
 *
 * @example
 * <Badge>Standard</Badge>
 * <Badge variant="success">Verfügbar</Badge>
 * <Badge variant="warning">Wenige auf Lager</Badge>
 * <Badge variant="destructive">Ausverkauft</Badge>
 *
 * @example
 * <Badge variant="carvantooo">Shop</Badge>
 * <Badge variant="opencarbox">Werkstatt</Badge>
 */
function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

