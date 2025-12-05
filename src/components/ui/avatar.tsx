import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

/**
 * Avatar-Root-Komponente
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * Avatar-Bild-Komponente
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * Avatar-Fallback-Komponente (wird angezeigt wenn kein Bild)
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/**
 * Props für den einfachen Avatar-Wrapper
 */
interface SimpleAvatarProps {
  /** Bild-URL */
  src?: string;
  /** Alt-Text für das Bild */
  alt?: string;
  /** Fallback-Text (z.B. Initialen) */
  fallback: string;
  /** Größe des Avatars */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Größen-Mapping für Avatar
 */
const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

/**
 * Vereinfachter Avatar mit eingebautem Fallback.
 *
 * @example
 * <SimpleAvatar
 *   src="/avatars/user.jpg"
 *   alt="Max Mustermann"
 *   fallback="MM"
 *   size="lg"
 * />
 */
function SimpleAvatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: SimpleAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={alt || fallback} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, SimpleAvatar };

