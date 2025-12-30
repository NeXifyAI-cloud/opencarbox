/**
 * Card Component - OpenCarBox & Carvantooo
 *
 * Flexible Card-Komponente für Produkte, Services und Content.
 * Unterstützt verschiedene Varianten für beide Marken.
 *
 * @module components/ui/card
 */

import { cn } from '@/lib/utils';
import * as React from 'react';

/**
 * Card Container
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200',
      'hover:shadow-md hover:border-slate-300',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * Card Header
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * Card Title
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-slate-900',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * Card Description
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-600', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * Card Content
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * Card Footer
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

/**
 * Card Image Container
 */
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative aspect-[4/3] overflow-hidden rounded-t-xl',
      className
    )}
    {...props}
  />
));
CardImage.displayName = 'CardImage';

export {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle
};
