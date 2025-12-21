'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Star, ShoppingBag, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shared/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';

/**
 * Carvantooo Shop Landing Page - Dynamisch mit Supabase
 */
export default function ShopPage() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="pb-20">
      {/* Shop Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-red opacity-20" />
        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <Badge variant="carvantooo" className="mb-6 px-4 py-1.5 text-sm font-bold">
              Carvantooo Parts
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              Ersatzteile in <span className="text-carvantooo-500">Premium-Qualität</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Finden Sie garantiert passende Teile mit unserer intelligenten HSN/TSN Suche.
              Wir liefern Originalqualität für jedes Fahrzeug.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-gradient-red h-16 px-10 text-xl font-bold rounded-xl shadow-lg shadow-carvantooo-500/20">
                Zum Katalog
              </Button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <ShieldCheck className="w-6 h-6 text-carvantooo-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-500 uppercase">Qualitätsgarantie</div>
                  <div className="text-sm font-bold">Geprüfte Originalteile</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 bg-white border-b relative z-10">
        <div className="container-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-carvantooo-50 transition-colors">
                <Truck className="w-6 h-6 text-carvantooo-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Blitzversand</div>
                <div className="text-xs text-slate-500 font-medium">Heute bestellt, morgen da</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-carvantooo-50 transition-colors">
                <Package className="w-6 h-6 text-carvantooo-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900">30 Tage Rückgabe</div>
                <div className="text-xs text-slate-500 font-medium">Kostenlose Rücksendung</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-carvantooo-50 transition-colors">
                <Star className="w-6 h-6 text-carvantooo-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Expertensupport</div>
                <div className="text-xs text-slate-500 font-medium">Von KFZ-Meistern beraten</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-carvantooo-50 transition-colors">
                <ShoppingBag className="w-6 h-6 text-carvantooo-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Click & Collect</div>
                <div className="text-xs text-slate-500 font-medium">Abholung in 1030 Wien</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <section className="py-20 container-content">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Bestseller & Empfehlungen</h2>
            <p className="text-slate-500">Die meistverkauften Ersatzteile für Ihr Fahrzeug.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm font-bold">
              <LayoutGrid className="w-4 h-4 mr-2" /> Grid
            </Button>
            <Button variant="ghost" size="sm" className="font-bold text-slate-500">
              <List className="w-4 h-4 mr-2" /> Liste
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium">
              Fehler beim Laden der Produkte.
            </div>
          ) : products && products.length > 0 ? (
            products.map((p: any) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                brand={p.brand || 'Original'}
                price={Number(p.price_gross)}
                image={p.images?.[0] || 'https://via.placeholder.com/400'}
                rating={4.5}
                reviews={10}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium">
              Keine Produkte gefunden.
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Button className="h-14 px-12 btn-gradient-red text-lg font-bold rounded-xl shadow-xl shadow-carvantooo-500/20">
            Alle Produkte ansehen
          </Button>
        </div>
      </section>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
