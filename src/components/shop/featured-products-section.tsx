import React from 'react';
import { getFeaturedProducts } from '@/lib/api/products';
import { ProductCard } from './product-card';
import { featuredProducts as mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function FeaturedProductsSection() {
  const dbProducts = await getFeaturedProducts(6);

  // Mapping mock products to match our internal Product type if needed
  const displayProducts = dbProducts.length > 0
    ? dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        slug: p.slug,
        rating: 4.8, // Mock rating since not in DB yet
        reviewsCount: 124 // Mock count
      }))
    : mockProducts.map(p => ({
        id: p.id.toString(),
        name: p.name,
        brand: p.brand,
        price: p.price,
        comparePrice: p.originalPrice,
        images: p.image,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        rating: p.rating,
        reviewsCount: p.reviews
      }));

  return (
    <section className="py-16 container-content">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Top Angebote</h2>
          <p className="text-slate-500">Aktuelle Highlights aus unserem Sortiment.</p>
        </div>
        <Link href="/shop/produkte">
          <Button variant="ghost" className="rounded-xl font-bold group">
            Alle ansehen
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
