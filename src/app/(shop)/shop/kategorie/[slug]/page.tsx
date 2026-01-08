'use client';

import { ProductFilter } from '@/components/shop/product-filter';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductSort } from '@/components/shop/product-sort';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { featuredProducts } from '@/lib/mock-data';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Mock data filtering
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const products = featuredProducts; // In real app, filter by category

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="container-content py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-carvantooo-500 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-carvantooo-500 transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium">{categoryName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 hidden lg:block">
          <ProductFilter />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">{categoryName}</h1>
              <p className="text-slate-500 text-sm mt-1">{products.length} Produkte gefunden</p>
            </div>

            <div className="flex items-center gap-4">
               <Button variant="outline" className="lg:hidden">
                 <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
               </Button>
               <ProductSort />
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
              BOSCH <span className="ml-1 cursor-pointer">×</span>
            </Badge>
            <Button variant="link" size="sm" className="text-carvantooo-500 h-auto p-0">
              Alle Filter löschen
            </Button>
          </div>

          {/* Grid */}
          <ProductGrid products={products} />

           {/* Pagination */}
           <div className="mt-12 flex justify-center">
             <div className="flex gap-2">
               <Button variant="outline" disabled>Zurück</Button>
               <Button variant="default" className="bg-carvantooo-500 hover:bg-carvantooo-600">1</Button>
               <Button variant="outline">2</Button>
               <Button variant="outline">3</Button>
               <Button variant="outline">Weiter</Button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
