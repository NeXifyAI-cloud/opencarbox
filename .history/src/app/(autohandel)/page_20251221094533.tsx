'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Search, Fuel, Settings2, Gauge, Info, ChevronRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const vehicles = [
  {
    id: 1,
    title: 'Mercedes-Benz E 220 d AMG Line',
    price: 45900,
    year: 2021,
    mileage: 32500,
    fuel: 'Diesel',
    transmission: 'Automatik',
    power: '194 PS',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 2,
    title: 'BMW M3 Competition',
    price: 89900,
    year: 2022,
    mileage: 12800,
    fuel: 'Benzin',
    transmission: 'Automatik',
    power: '510 PS',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 3,
    title: 'Audi Q5 40 TDI quattro',
    price: 52400,
    year: 2022,
    mileage: 21500,
    fuel: 'Diesel',
    transmission: 'Automatik',
    power: '204 PS',
    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800',
    featured: false
  }
];

/**
 * OpenCarBox Autohandel Landing Page
 */
export default function AutohandelPage() {
  return (
    <div className="pb-20">
      {/* Autohandel Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue opacity-30" />
        <div className="container-content relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
              Finden Sie Ihr <span className="text-opencarbox-500">Traumauto</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12">
              Premium Gebrauchtwagen mit 100-Punkte-Check, Garantie und
              maßgeschneiderter Finanzierung. Professionell & Fair.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn-gradient-blue h-14 px-10 text-lg font-bold rounded-xl">
                Bestand ansehen
              </Button>
              <Button variant="outline" className="h-14 px-10 text-lg font-bold border-white/20 hover:bg-white/10 text-white rounded-xl">
                Inzahlungnahme
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="py-8 bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container-content">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Marke, Modell oder Schlagwort..."
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-200 focus:border-opencarbox-500 focus:ring-4 focus:ring-opencarbox-500/10 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-12 gap-2">
                <Settings2 className="w-4 h-4" /> Filter
              </Button>
              <Button className="h-12 btn-gradient-blue px-8 font-bold">
                Angebote finden
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Listing */}
      <section className="py-20 container-content">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold">Aktuelle Angebote</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Car className="w-4 h-4" /> 124 Fahrzeuge verfügbar
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card-premium flex flex-col group h-full overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={v.image}
                  alt={v.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  {v.featured && (
                    <Badge className="bg-opencarbox-500 text-white font-bold px-3 py-1">Top Angebot</Badge>
                  )}
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md text-slate-900 font-bold px-4 py-2 rounded-lg text-lg">
                    € {v.price.toLocaleString('de-DE')}
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-4 group-hover:text-opencarbox-600 transition-colors">
                  {v.title}
                </h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 text-opencarbox-500" />
                    EZ {v.year}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Gauge className="w-4 h-4 text-opencarbox-500" />
                    {v.mileage.toLocaleString('de-DE')} km
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Fuel className="w-4 h-4 text-opencarbox-500" />
                    {v.fuel}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Settings2 className="w-4 h-4 text-opencarbox-500" />
                    {v.transmission}
                  </div>
                </div>

                <div className="pt-6 border-t mt-auto flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Info className="w-3 h-3" /> Inkl. 12 Monate Garantie
                  </span>
                  <Button variant="ghost" className="text-opencarbox-600 font-bold gap-1 p-0 hover:bg-transparent hover:gap-2 transition-all">
                    Details <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" className="h-14 px-12 text-lg font-bold border-slate-200 hover:bg-slate-50 rounded-xl">
            Alle Fahrzeuge laden
          </Button>
        </div>
      </section>
    </div>
  );
}
