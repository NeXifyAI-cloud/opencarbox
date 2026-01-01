import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props für die Input-Komponente
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Fehler-Nachricht (zeigt roten Border) */
  error?: string;
  /** Hilfstext unter dem Input */
  helperText?: string;
  /** Label über dem Input */
  label?: string;
  /** Icon links im Input */
  leftIcon?: React.ReactNode;
  /** Icon rechts im Input */
  rightIcon?: React.ReactNode;
}

/**
 * Input-Komponente für Texteingaben.
 * Unterstützt Label, Fehleranzeige, Hilfstext und Icons.
 *
 * @example
 * <Input
 *   label="E-Mail-Adresse"
 *   type="email"
 *   placeholder="name@beispiel.at"
 *   error={errors.email?.message}
 * />
 *
 * @example
 * <Input
 *   leftIcon={<SearchIcon className="h-4 w-4" />}
 *   placeholder="Suche nach Ersatzteilen..."
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      label,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              error ? 'text-destructive' : 'text-foreground',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base Styles
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
              'transition-colors duration-200',
              // Placeholder
              'placeholder:text-muted-foreground',
              // Focus
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // File Input
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              // Error State
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input',
              // Icons Padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error || helperText ? `${inputId}-description` : undefined
            }
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error / Helper Text */}
        {(error || helperText) && (
          <p
            id={`${inputId}-description`}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };