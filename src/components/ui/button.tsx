/**
 * Button Component - OpenCarBox & Carvantooo
 * 
 * Premium Button mit Brand-Varianten und Loading-States.
 * Basiert auf Radix Slot für flexible Composition.
 * 
 * @module components/ui/button
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button Varianten Definition
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Carvantooo Rot (Shop)
        'primary-red':
          'bg-carvantooo-500 text-white hover:bg-carvantooo-600 active:bg-carvantooo-700 shadow-sm hover:shadow-md hover:shadow-carvantooo-glow',
        'gradient-red':
          'bg-gradient-carvantooo text-white hover:opacity-90 shadow-md hover:shadow-lg hover:shadow-carvantooo-glow',
        
        // OpenCarBox Blau (Services)
        'primary-blue':
          'bg-opencarbox-500 text-white hover:bg-opencarbox-600 active:bg-opencarbox-700 shadow-sm hover:shadow-md hover:shadow-opencarbox-glow',
        'gradient-blue':
          'bg-gradient-opencarbox text-white hover:opacity-90 shadow-md hover:shadow-lg hover:shadow-opencarbox-glow',
        
        // Neutrale Varianten
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300',
        outline:
          'border-2 border-slate-200 bg-transparent hover:bg-slate-100 hover:border-slate-300',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900',
        link:
          'text-carvantooo-600 underline-offset-4 hover:underline',
        destructive:
          'bg-error-500 text-white hover:bg-error-600 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary-red',
      size: 'md',
    },
  }
);

/**
 * Button Props Interface
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Als Child-Komponente rendern (für Link-Wrapper etc.)
   */
  asChild?: boolean;
  /**
   * Loading State - zeigt Spinner an
   */
  loading?: boolean;
  /**
   * Icon links vom Text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon rechts vom Text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button Komponente
 * 
 * @example
 * ```tsx
 * // Carvantooo Shop Button
 * <Button variant="primary-red">In den Warenkorb</Button>
 * <Button variant="gradient-red" size="lg">Jetzt kaufen</Button>
 * 
 * // OpenCarBox Service Button
 * <Button variant="primary-blue">Termin buchen</Button>
 * <Button variant="gradient-blue" size="lg">Service anfragen</Button>
 * 
 * // Mit Loading State
 * <Button loading>Wird geladen...</Button>
 * 
 * // Mit Icons
 * <Button leftIcon={<ShoppingCart />}>Warenkorb</Button>
 * <Button rightIcon={<ArrowRight />}>Weiter</Button>
 * 
 * // Als Link
 * <Button asChild>
 *   <Link href="/shop">Zum Shop</Link>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

