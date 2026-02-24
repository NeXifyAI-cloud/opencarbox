import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand?: string | null;
    price: number;
    comparePrice?: number | null;
    images: string;
    slug: string;
    rating?: number;
    reviewsCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images.split(',');
  const mainImage = images[0] || '/api/placeholder/400/400';
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={`/shop/produkt/${product.slug}`} className="relative aspect-square overflow-hidden block">
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
            -${discount}%
          </div>
        )}
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand || 'Original'}</span>
        </div>

        <Link href={`/shop/produkt/${product.slug}`} className="block group-hover:text-primary-600 transition-colors">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug h-10">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-3 h-3 fill-current", i >= (product.rating || 5) && "text-slate-200 fill-transparent")} />
            ))}
          </div>
          <span className="text-[10px] font-medium text-slate-400">({product.reviewsCount || 0})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.comparePrice && (
              <span className="text-[10px] text-slate-400 line-through leading-none mb-0.5">{product.comparePrice.toFixed(2)} €</span>
            )}
            <span className="text-lg font-black text-slate-900 leading-none">{product.price.toFixed(2)} €</span>
          </div>

          <Button size="icon" variant="secondary" className="rounded-lg h-9 w-9 bg-slate-50 hover:bg-primary-500 hover:text-white transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
