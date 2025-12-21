import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Card-Komponenten (shadcn/ui kompatibel)
 *
 * Diese Komponenten bilden eine konsistente Karten-Basis für Layouts.
 * @see docs/design-system/components.md
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white text-slate-950 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        className
      )}
      {...props}
    />
  )
);
