'use client';

import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Turbo-Badge für Express-Services und Premium-Features
 */
export function TurboBadge({
  children = 'TURBO',
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/20 animate-pulse',
        'flex items-center gap-1 font-bold tracking-wider',
        className
      )}
      {...props}
    >
      <Zap className="w-3 h-3" />
      {children}
    </Badge>
  );
}

export default TurboBadge;