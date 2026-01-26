'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Turbo-Button für Express-Aktionen mit animiertem Blitz-Icon
 */
export function TurboButton({
  children,
  className,
  showIcon = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  [key: string]: any;
}) {
  return (
    <Button
      className={cn(
        'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/20',
        'transform transition-all duration-200 hover:scale-105 active:scale-95',
        'flex items-center gap-2 font-bold',
        className
      )}
      {...props}
    >
      {showIcon && <Zap className="w-4 h-4 animate-pulse" />}
      {children}
    </Button>
  );
}

export default TurboButton;