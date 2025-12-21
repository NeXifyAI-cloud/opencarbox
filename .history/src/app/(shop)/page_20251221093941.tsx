'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, Star, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Carvantooo Shop Landing Page
 */
export default function ShopPage() {
  return (
    <div className="pb-20">
      {/* Shop Hero */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-red opacity-20" />
        <div className="container-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Premium <span className="text-carvantooo-500">Autoteile</span> für Ihr Fahrzeug
            </h1>
            <p className="text-xl text-slate-400 mb-10">
              Finden Sie garantiert passende Teile mit unserer intelligenten HSN/TSN Suche.
              Qualität vom Experten, direkt geliefert.
            </p>
            <div className="flex gap-4">
              <Button className="btn-gradient-red h-14 px-8 text-lg font-bold">
                Jetzt Shoppen
              </Button>
              <Button variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 hover:bg-white/10 text-white">
                Angebote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 border-b bg-white">
        <div className="container-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-carvantooo-500" />
              <div>
                <div className="font-bold text-sm">Gratis Versand</div>
                <div className="text-xs text-slate-500">Ab 50€ Bestellwert</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-carvantooo-500" />
              <div>
                <div className="font-bold text-sm">Geprüfte Qualität</div>
                <div className="text-xs text-slate-500">Original Ersatzteile</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-carvantooo-500" />
              <div>
                <div className="font-bold text-sm">Top Bewertung</div>
                <div className="text-xs text-slate-500">4.9/5 Sternen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-carvantooo-500" />
              <div>
                <div className="font-bold text-sm">30 Tage Rückgabe</div>
                <div className="text-xs text-slate-500">Sorglos einkaufen</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Placeholder */}
      <section className="py-20 container-content">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold">Beliebte Kategorien</h2>
          <Button variant="ghost" className="text-carvantooo-600 font-bold flex items-center gap-2">
            Alle ansehen <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Bremsanlage', count: '1.240 Artikel' },
            { name: 'Filter & Öle', count: '850 Artikel' },
            { name: 'Fahrwerk', count: '2.100 Artikel' },
            { name: 'Elektrik', count: '3.400 Artikel' },
          ].map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card-premium p-8 group cursor-pointer hover:border-carvantooo-500 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 mb-6 group-hover:bg-carvantooo-50 transition-colors flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-carvantooo-500 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-500">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

