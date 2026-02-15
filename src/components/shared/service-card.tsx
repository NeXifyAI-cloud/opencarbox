import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props für die ServiceCard Komponente
 */
interface ServiceCardProps {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  priceFrom?: number;
  durationMinutes?: number;
  category: string;
  image?: string;
  features?: string[];
  className?: string;
}

/**
 * Premium Service-Karte für die OpenCarBox Werkstatt.
 * Fokus auf Vertrauen, Professionalität und klare Informationen.
 */
export const ServiceCard = ({
  name,
  slug,
  description,
  priceFrom,
  durationMinutes,
  category,
  image,
  features = [],
  className,
}: ServiceCardProps) => {
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
      {/* Image / Header */}
      {image ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 rounded-full bg-opencarbox-500 text-white text-[10px] font-bold uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 pb-0">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-opencarbox-600 transition-colors">
          {name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <ul className="space-y-2 mb-8">
            {features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-opencarbox-500" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Info Bar */}
        <div className="mt-auto flex items-center justify-between py-4 border-t border-slate-100">
          <div className="flex flex-col">
            {priceFrom && (
              <>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ab</span>
                <div className="text-xl font-display font-bold text-slate-900">
                  € {priceFrom.toFixed(2)}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {durationMinutes && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">{durationMinutes} Min.</span>
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              asChild
              className="rounded-full border-slate-200 hover:border-opencarbox-500 hover:bg-opencarbox-50 hover:text-opencarbox-600 transition-all"
            >
              <Link href={`/werkstatt/services/${slug}`}>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
