'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Car,
    CheckCircle2,
    ChevronRight,
    Clock,
    Search,
    ShieldCheck,
    Star,
    Truck,
    Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Carvantooo Shop Landing Page - kfzteile24 Inspired Premium Design
 */
export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. Top Vehicle Finder Section (kfzteile24 Style) */}
      <section className="bg-slate-900 pt-8 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-red opacity-10" />
        <div className="container-content relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Headline */}
            <div className="lg:col-span-5 text-white">
              <Badge variant="carvantooo" className="mb-4">
                Carvantooo Parts & Service
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
                Die richtigen Teile für <span className="text-carvantooo-500 italic">Dein Auto.</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-md">
                Finden Sie garantiert passende Ersatzteile mit unserer HSN/TSN Suche oder über Ihr Fahrzeugmodell.
              </p>

              <div className="hidden lg:flex items-center gap-6 mt-12">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <Image src={`/api/placeholder/40/40`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center text-yellow-400 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <p className="text-slate-400 font-medium">4.9/5 von über 10.000 Kunden</p>
                </div>
              </div>
            </div>

            {/* Right: Finder Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex border-b">
                  <button className="flex-1 py-4 text-sm font-bold border-b-2 border-carvantooo-500 text-slate-900 flex items-center justify-center gap-2">
                    <Search className="w-4 h-4 text-carvantooo-500" /> HSN/TSN Suche
                  </button>
                  <button className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 bg-slate-50">
                    <Car className="w-4 h-4" /> Fahrzeug wählen
                  </button>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">HSN (2.1)</label>
                      <Input placeholder="z.B. 0603" className="h-12 text-lg font-mono uppercase" maxLength={4} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">TSN (2.2)</label>
                      <Input placeholder="z.B. ADO" className="h-12 text-lg font-mono uppercase" maxLength={3} />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-4 mb-6 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Clock className="w-5 h-5 text-carvantooo-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Sie finden diese Nummern in Ihrem Fahrzeugschein im mittleren Teil unter 2.1 und 2.2.
                      </p>
                    </div>
                  </div>

                  <Button variant="gradient-red" size="xl" className="w-full rounded-xl shadow-lg shadow-carvantooo-500/20 group">
                    Passende Teile finden
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators */}
      <section className="bg-white border-b py-6">
        <div className="container-content">
          <div className="flex flex-wrap justify-between gap-6 lg:gap-12">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-carvantooo-500" />
              <span className="text-sm font-bold text-slate-700">100 Tage Rückgaberecht</span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <Truck className="w-5 h-5 text-carvantooo-500" />
              <span className="text-sm font-bold text-slate-700">Versand heute bis 18 Uhr</span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <ShieldCheck className="w-5 h-5 text-carvantooo-500" />
              <span className="text-sm font-bold text-slate-700">Sicher verschlüsselt</span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200 hidden md:flex">
              <Zap className="w-5 h-5 text-carvantooo-500" />
              <span className="text-sm font-bold text-slate-700">Bestpreis Garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Tiles (kfzteile24 Style) */}
      <section className="py-16 container-content">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Ersatzteile nach Kategorie</h2>
            <p className="text-slate-500">Wählen Sie einen Bereich, um alle passenden Teile zu sehen.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex rounded-xl font-bold border-slate-200">
            Alle Kategorien
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Bremsanlage', icon: '🛑', color: 'bg-red-50' },
            { name: 'Filter', icon: '🧪', color: 'bg-blue-50' },
            { name: 'Motor', icon: '⚙️', color: 'bg-slate-100' },
            { name: 'Zündanlage', icon: '⚡', color: 'bg-orange-50' },
            { name: 'Fahrwerk', icon: '⛓️', color: 'bg-indigo-50' },
            { name: 'Karosserie', icon: '🚗', color: 'bg-emerald-50' },
            { name: 'Elektrik', icon: '💡', color: 'bg-yellow-50' },
            { name: 'Kühlung', icon: '❄️', color: 'bg-cyan-50' },
            { name: 'Auspuff', icon: '💨', color: 'bg-stone-100' },
            { name: 'Lenkung', icon: '🔘', color: 'bg-purple-50' },
            { name: 'Heizung', icon: '🔥', color: 'bg-orange-100' },
            { name: 'Reifen', icon: '🛞', color: 'bg-slate-900 text-white' },
          ].map((cat, i) => (
            <Link key={i} href={`/shop/kategorie/${cat.name.toLowerCase()}`} className="group">
              <div className={cn(
                "h-full p-6 rounded-2xl transition-all border border-transparent hover:border-carvantooo-200 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col items-center text-center gap-4",
                cat.color || "bg-white"
              )}>
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className="text-sm font-bold text-inherit">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Promotional Banners */}
      <section className="py-8 container-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-carvantooo-500 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 text-white">
              <Badge className="bg-white/20 text-white mb-4 border-none backdrop-blur-md">Sonderaktion</Badge>
              <h3 className="text-3xl font-display font-bold mb-4">Bremswochen bei <br/>Carvantooo</h3>
              <p className="text-white/80 mb-6 max-w-xs">Sichern Sie sich bis zu 20% Rabatt auf alle Bremsscheiben und Beläge namhafter Hersteller.</p>
              <Button className="bg-white text-carvantooo-500 hover:bg-slate-100 rounded-xl font-bold h-12 px-8">
                Jetzt sparen
              </Button>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/api/placeholder/400/300')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="bg-opencarbox-500 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10 text-white">
              <Badge className="bg-white/20 text-white mb-4 border-none backdrop-blur-md">Werkstatt-Service</Badge>
              <h3 className="text-3xl font-display font-bold mb-4">Direkt-Einbau <br/>buchen</h3>
              <p className="text-white/80 mb-6 max-w-xs">Teile online kaufen und direkt in unserer Meisterwerkstatt in 1030 Wien fachgerecht einbauen lassen.</p>
              <Button className="bg-white text-opencarbox-500 hover:bg-slate-100 rounded-xl font-bold h-12 px-8">
                Termin vereinbaren
              </Button>
            </div>
            <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/api/placeholder/400/300')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* 5. Featured Brands */}
      <section className="py-20 bg-slate-100/50 mt-12">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Unsere Top-Marken</h2>
            <p className="text-slate-500">Nur Originalqualität von führenden Automobilzulieferern.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Logos */}
             {['BOSCH', 'ATE', 'MANN', 'BREMBO', 'SACHS', 'CASTROL'].map(brand => (
               <span key={brand} className="text-2xl font-black text-slate-400 tracking-tighter">{brand}</span>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
