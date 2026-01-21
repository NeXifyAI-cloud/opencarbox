import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gauge, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props für die VehicleCard Komponente
 */
interface VehicleCardProps {
  id: string | number;
  title: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg';
  transmission: 'manual' | 'automatic';
  powerPs?: number;
  image: string;
  className?: string;
}

/**
 * Premium Fahrzeug-Karte für den OpenCarBox Autohandel.
 * Fokus auf technische Daten und hochwertige Präsentation.
 */
export const VehicleCard = ({
  title,
  slug,
  make,
  year,
  mileage,
  price,
  fuelType,
  transmission,
  powerPs,
  image,
  className,
}: VehicleCardProps) => {
  const fuelLabels: Record<string, string> = {
    petrol: 'Benzin',
    diesel: 'Diesel',
    electric: 'Elektro',
    hybrid: 'Hybrid',
    lpg: 'LPG',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-opencarbox-500/10 hover:border-opencarbox-200",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {year}
          </span>
          <span className="px-3 py-1 rounded-lg bg-opencarbox-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-opencarbox-500/20">
            {fuelLabels[fuelType]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-opencarbox-500">
            {make}
          </span>
          <span className="text-sm font-bold text-slate-400">
            {transmission === 'automatic' ? 'Automatik' : 'Schaltgetriebe'}
          </span>
        </div>

        <Link href={`/fahrzeuge/${slug}`}>
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-6 group-hover:text-opencarbox-600 transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Gauge className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Laufleistung</span>
              <span className="text-sm font-bold text-slate-900">{mileage.toLocaleString('de-DE')} km</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Zap className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Leistung</span>
              <span className="text-sm font-bold text-slate-900">{powerPs} PS</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verkaufspreis</span>
            <div className="text-2xl font-display font-bold text-slate-900">
              € {price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
            </div>
          </div>

          <Button
            className="rounded-xl btn-gradient-blue shadow-lg shadow-opencarbox-500/20 h-12 px-6"
            asChild
          >
            <Link href={`/fahrzeuge/${slug}`}>
              Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
