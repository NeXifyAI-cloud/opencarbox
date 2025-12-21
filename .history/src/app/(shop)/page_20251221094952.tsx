'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Filter, Truck, ShieldCheck, Star, ShoppingBag, ChevronRight, Package, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const products = [
  {
    id: 1,
    name: 'Bremsscheiben Set Vorne',
    brand: 'Brembo',
    price: 129.90,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
    category: 'Bremsanlage'
  },
  {
    id: 2,
    name: 'Motoröl 5W-30 Longlife III',
    brand: 'Castrol',
    price: 54.50,
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1635815124110-54737d6e462e?auto=format&fit=crop&q=80&w=400',
    category: 'Öle & Flüssigkeiten'
  },
  {
    id: 3,
    name: 'Zündkerzen Platin Set',
    brand: 'NGK',
    price: 42.00,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1632733711679-5292d6676231?auto=format&fit=crop&q=80&w=400',
    category: 'Motor'
  },
  {
    id: 4,
    name: 'Innenraumfilter Aktivkohle',
    brand: 'MANN-FILTER',
    price: 24.90,
    rating: 4.6,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1549892898-37b9ff4223cd?auto=format&fit=crop&q=80&w=400',
    category: 'Filter'
  }
];

/**
 * Carvantooo Shop Landing Page - Überarbeitet
 */
export default function ShopPage() {
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
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card-premium group flex flex-col h-full overflow-hidden"
            >
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  aria-label="In den Warenkorb"
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 hover:bg-carvantooo-500 hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="text-[10px] font-bold uppercase tracking-wider text-carvantooo-500 mb-2">
                  {p.brand}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-carvantooo-600 transition-colors line-clamp-2">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3 fill-current", i >= Math.floor(p.rating) && "text-slate-200 fill-none")} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">({p.reviews})</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="text-xl font-bold text-slate-900">
                    € {p.price.toFixed(2)}
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 text-carvantooo-600 font-bold hover:bg-transparent hover:gap-2 transition-all">
                    Details <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
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
