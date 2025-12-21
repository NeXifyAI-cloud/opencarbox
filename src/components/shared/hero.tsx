'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Premium Hero Komponente für die Landing Page
 */
export const Hero: FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-mesh-red texture-noise overflow-hidden">
      {/* Animierte Hintergrund-Elemente */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
      />

      <div className="relative z-10 container-content text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-800 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-carvantooo-500 animate-pulse" />
            Willkommen bei Ihrer Automotive Premium Plattform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-slate-900 mb-8 tracking-tighter"
        >
          <span className="text-gradient-red">OpenCarBox</span>
          <br className="sm:hidden" />
          <span className="text-slate-400 mx-4 hidden sm:inline">&</span>
          <br className="sm:hidden" />
          <span className="text-gradient-blue">Carvantooo</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Ihr Partner für{' '}
          <strong className="text-opencarbox-600">KFZ-Service</strong>,{' '}
          <strong className="text-opencarbox-600">Autohandel</strong> und{' '}
          <strong className="text-carvantooo-600">Premium Autoteile</strong>.
          <br />
          <span className="text-slate-500 italic">"Weil das Auto zur Familie gehört."</span>
        </motion.p>

        {/* Fahrzeug-Finder Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="card-glass max-w-3xl mx-auto p-2 sm:p-3 mb-12 shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-carvantooo-500/5 to-opencarbox-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 flex flex-col gap-6 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-carvantooo-500" />
                Fahrzeugspezifische Suche
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-success" />
                HSN/TSN Unterstützung
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="HSN/TSN oder Kennzeichen..."
                  className="w-full h-14 pl-5 pr-4 rounded-xl border border-slate-200 focus:border-carvantooo-500 focus:ring-4 focus:ring-carvantooo-500/10 outline-none transition-all text-lg font-medium"
                />
              </div>
              <Button className="h-14 px-10 rounded-xl btn-gradient-red text-lg font-bold shadow-lg shadow-carvantooo-500/20 hover:scale-[1.02] active:scale-[0.98]">
                Teile finden
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Über 1 Mio. Teile</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 24h Express</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Bestpreis Garantie</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Entdecken</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};
