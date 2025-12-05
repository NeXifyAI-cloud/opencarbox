/**
 * UI-Komponenten - OpenCarBox & Carvantooo
 *
 * Zentrale Export-Datei für alle UI-Komponenten.
 * Importiere Komponenten von hier für konsistente Verwendung.
 *
 * @example
 * import { Button, Input, Badge, Spinner } from '@/components/ui';
 */

// Atoms
export { Button, buttonVariants } from './button';
export { Input, type InputProps } from './input';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Avatar, AvatarImage, AvatarFallback, SimpleAvatar } from './avatar';
export { Spinner, PageSpinner, LoadingOverlay } from './spinner';
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonProductCard,
  SkeletonTableRow,
} from './skeleton';

