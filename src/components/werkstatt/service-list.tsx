'use client';

import { ServiceCard } from '@/components/shared/service-card';
import { type Service } from '@/lib/mock-data';

interface ServiceListProps {
  services: Service[];
  isLoading?: boolean;
  category?: string;
}

/**
 * ServiceList Organismus-Komponente für die OpenCarBox Werkstatt.
 * Zeigt eine Liste von Service-Karten mit Loading-States und Filter-Optionen.
 */
export function ServiceList({ services, isLoading = false, category }: ServiceListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[500px] bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {category ? `Keine Services in ${category}` : 'Keine Services gefunden'}
        </h3>
        <p className="text-slate-500">
          Bitte versuchen Sie eine andere Kategorie oder kontaktieren Sie uns direkt.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          name={service.name}
          slug={service.slug}
          description={service.description}
          priceFrom={service.priceFrom}
          durationMinutes={service.durationMinutes}
          category={service.category}
          image={service.image}
          features={service.features}
        />
      ))}
    </div>
  );
}

export default ServiceList;