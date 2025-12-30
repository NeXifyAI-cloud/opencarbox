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
export { Avatar, AvatarFallback, AvatarImage, SimpleAvatar } from './avatar';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Button, buttonVariants } from './button';
export { Input, type InputProps } from './input';
export {
    Skeleton, SkeletonAvatar,
    SkeletonCard,
    SkeletonProductCard,
    SkeletonTableRow, SkeletonText
} from './skeleton';
export { LoadingOverlay, PageSpinner, Spinner } from './spinner';

// Card Components
export {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardImage, CardTitle
} from './card';
