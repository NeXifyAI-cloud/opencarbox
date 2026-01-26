'use client';

import { ProductCard } from '@/components/shared/product-card';
import { type FeaturedProduct } from '@/lib/mock-data';

interface ProductGridProps {
  products: FeaturedProduct[];
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  viewMode = 'grid',
  onViewModeChange
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "space-y-6"
      }>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={viewMode === 'grid'
            ? "h-[400px] bg-slate-100 rounded-xl animate-pulse"
            : "h-[200px] bg-slate-100 rounded-xl animate-pulse"
          } />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Keine Produkte gefunden</h3>
        <p className="text-slate-500">Bitte passen Sie Ihre Filter an.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid'
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      : "space-y-6"
    }>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.name.toLowerCase().replace(/ /g, '-')}
          brand={product.brand}
          price={product.price}
          rating={product.rating}
          reviews={product.reviews}
          image={product.image}
        />
      ))}
    </div>
  );
}
