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
