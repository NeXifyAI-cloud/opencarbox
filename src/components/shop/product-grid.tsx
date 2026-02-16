'use client';

import { ProductCard } from '@/components/shared/product-card';
import { type FeaturedProduct } from '@/lib/mock-data';
import { getProductSlug } from '@/lib/shop-products';

interface ProductGridProps {
  products: FeaturedProduct[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[400px] bg-slate-100 rounded-xl animate-pulse" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={getProductSlug(product.name)}
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
