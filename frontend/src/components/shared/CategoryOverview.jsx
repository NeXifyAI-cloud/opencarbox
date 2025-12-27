import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Wrench, Car, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { serviceAreas } from '../../data/mockData';

// Map icons string to component
const iconMap = {
  ShoppingCart,
  Wrench,
  Car
};

export const CategoryOverview = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
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
          {serviceAreas.map((cat, idx) => {
            const Icon = iconMap[cat.icon];
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group h-full"
              >
                <div className={cn(
                  "bg-white rounded-2xl shadow-card-premium p-8 h-full flex flex-col border-t-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
                  cat.color === 'carvantooo' ? "border-t-carvantooo-500" : "border-t-opencarbox-500"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300",
                    cat.color === 'carvantooo' ? "bg-carvantooo-50" : "bg-opencarbox-50"
                  )}>
                    {Icon && <Icon className={cn(
                      "w-8 h-8",
                      cat.color === 'carvantooo' ? "text-carvantooo-500" : "text-opencarbox-500"
                    )} />}
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
                    to={cat.href}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
