'use client';

import { Package, RotateCcw, Shield, Truck, Users } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Über 3 Millionen',
    subtitle: 'zufriedene Kunden'
  },
  {
    icon: Package,
    title: 'Riesenauswahl: Über',
    subtitle: '3 Millionen Teile'
  },
  {
    icon: Truck,
    title: 'Versand heute bei',
    subtitle: 'Bestellungen bis 15 Uhr'
  },
  {
    icon: RotateCcw,
    title: '30 Tage kostenlose',
    subtitle: 'Rücksendungen'
  },
  {
    icon: Shield,
    title: 'Herstellergarantie',
    subtitle: 'auf alle Produkte'
  },
];

export function BenefitsBar() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex items-center gap-3 group cursor-default">
              <div className="bg-[#4fd1c5]/10 rounded-full p-2 group-hover:bg-[#4fd1c5]/20 transition-colors">
                <Icon className="h-6 w-6 text-[#4fd1c5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1e3a5f]">{benefit.title}</p>
                <p className="text-xs text-gray-500">{benefit.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BenefitsBar;
