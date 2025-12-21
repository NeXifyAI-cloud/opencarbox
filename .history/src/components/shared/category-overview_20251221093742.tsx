'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Wrench, Car, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  {
    title: 'Carvantooo Shop',
    description: 'Premium Autoteile mit HSN/TSN-Suche finden.',
    icon: ShoppingCart,
    href: '/shop',
    color: 'carvantooo',
    features: ['Über 100.000 Teile', 'Schnelle Lieferung', 'Sichere Bezahlung']
  },
  {
    title: 'OpenCarBox Werkstatt',
    description: 'Meisterbetrieb für Inspektion & Reparatur.',
    icon: Wrench,
    href: '/werkstatt',
    color: 'opencarbox',
    features: ['Online-Terminbuchung', 'Faire Preise', 'Herstellervorgaben']
  },
  {
    title: 'OpenCarBox Autohandel',
    description: 'Geprüfte Gebraucht- und Neuwagen.',
    icon: Car,
    href: '/fahrzeuge',
    color: 'opencarbox',
    features: ['Geprüfte Qualität', 'Finanzierung möglich', 'Inzahlungnahme']
  }
];

/**
 * Bereichsübersicht für die Landing Page
 */
export const CategoryOverview: FC = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container-content relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Alles aus einer Hand
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Egal ob Teile, Service oder Fahrzeugkauf – wir sind Ihr zuverlässiger Partner.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className={cn(
                "card-premium p-8 h-full flex flex-col border-t-4",
                cat.color === 'carvantooo' ? "border-t-carvantooo-500" : "border-t-opencarbox-500"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300",
                  cat.color === 'carvantooo' ? "bg-carvantooo-50" : "bg-opencarbox-50"
                )}>
                  <cat.icon className={cn(
                    "w-8 h-8",
                    cat.color === 'carvantooo' ? "text-carvantooo-500" : "text-opencarbox-500"
                  )} />
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  {cat.title}
                </h3>

                <p className="text-slate-600 mb-6 flex-grow">
                  {cat.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {cat.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        cat.color === 'carvantooo' ? "bg-carvantooo-500" : "bg-opencarbox-500"
                      )} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={cat.href}
                  className={cn(
                    "inline-flex items-center gap-2 font-bold transition-all group-hover:gap-3",
                    cat.color === 'carvantooo' ? "text-carvantooo-600" : "text-opencarbox-600"
                  )}
                >
                  Entdecken
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
