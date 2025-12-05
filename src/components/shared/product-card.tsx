'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from './price-display';
import { RatingCompact } from './rating';

/**
 * Produkt-Daten Interface
 */
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  sku?: string;
}

/**
 * Props für die ProductCard-Komponente
 */
interface ProductCardProps {
  /** Produkt-Daten */
  product: Product;
  /** Callback beim Hinzufügen zum Warenkorb */
  onAddToCart?: (product: Product) => void;
  /** Callback beim Hinzufügen zur Wunschliste */
  onAddToWishlist?: (product: Product) => void;
  /** Fahrzeug-Kompatibilität anzeigen */
  showCompatibility?: boolean;
  /** Kompatibilitäts-Status */
  isCompatible?: boolean;
  /** Layout-Variante */
  variant?: 'default' | 'compact' | 'horizontal';
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * ProductCard-Komponente für Produkt-Anzeige im Shop.
 *
 * @example
 * <ProductCard
 *   product={product}
 *   onAddToCart={(p) => addToCart(p)}
 *   showCompatibility
 *   isCompatible={true}
 * />
 */
export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  showCompatibility = false,
  isCompatible,
  variant = 'default',
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const productUrl = `/shop/produkte/${product.slug}`;

  // Horizontale Variante
  if (variant === 'horizontal') {
    return (
      <div
        className={cn(
          'group flex gap-4 rounded-xl border bg-card p-4',
          'transition-all duration-300',
          'hover:shadow-lg hover:shadow-carvantooo-500/5',
          className
        )}
      >
        {/* Bild */}
        <Link href={productUrl} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Eye className="h-8 w-8" />
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {product.category && (
              <span className="text-xs text-muted-foreground">{product.category}</span>
            )}
            <Link href={productUrl}>
              <h3 className="font-medium line-clamp-2 hover:text-carvantooo-500">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
            <Button
              size="sm"
              variant="carvantooo"
              onClick={() => onAddToCart?.(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default/Compact Variante
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border bg-card',
        'transition-all duration-300',
        'hover:shadow-xl hover:shadow-carvantooo-500/10',
        variant === 'compact' && 'p-2',
        variant === 'default' && 'p-4',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge variant="carvantooo">Neu</Badge>
        )}
        {product.isSale && (
          <Badge variant="destructive">Sale</Badge>
        )}
        {showCompatibility && isCompatible !== undefined && (
          <Badge variant={isCompatible ? 'success' : 'warning'}>
            {isCompatible ? 'Passend' : 'Prüfen'}
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={() => onAddToWishlist?.(product)}
        className={cn(
          'absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2',
          'opacity-0 transition-all duration-200',
          'hover:bg-white hover:text-carvantooo-500',
          isHovered && 'opacity-100'
        )}
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Bild */}
      <Link
        href={productUrl}
        className={cn(
          'relative aspect-square overflow-hidden rounded-lg bg-muted',
          variant === 'compact' && 'mb-2',
          variant === 'default' && 'mb-4'
        )}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Eye className="h-12 w-12" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Kategorie */}
        {product.category && (
          <span className="mb-1 text-xs text-muted-foreground">
            {product.category}
          </span>
        )}

        {/* Titel */}
        <Link href={productUrl}>
          <h3
            className={cn(
              'font-medium text-foreground line-clamp-2',
              'transition-colors hover:text-carvantooo-500',
              variant === 'compact' && 'text-sm',
              variant === 'default' && 'text-base'
            )}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="mt-1">
            <RatingCompact value={product.rating} count={product.reviewCount} />
          </div>
        )}

        {/* SKU */}
        {product.sku && variant === 'default' && (
          <span className="mt-1 text-xs text-muted-foreground">
            Art.-Nr.: {product.sku}
          </span>
        )}

        {/* Preis & Action */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size={variant === 'compact' ? 'sm' : 'md'}
            showDiscount
          />

          <Button
            size={variant === 'compact' ? 'icon' : 'sm'}
            variant="carvantooo"
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            title={product.inStock ? 'In den Warenkorb' : 'Nicht verfügbar'}
          >
            <ShoppingCart className="h-4 w-4" />
            {variant === 'default' && (
              <span className="ml-2 hidden lg:inline">Kaufen</span>
            )}
          </Button>
        </div>

        {/* Verfügbarkeit */}
        {!product.inStock && (
          <span className="mt-2 text-xs text-destructive">
            Derzeit nicht verfügbar
          </span>
        )}
      </div>
    </div>
  );
}

