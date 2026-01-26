'use client';

import { VehicleCard } from '@/components/shared/vehicle-card';
import { type Vehicle } from '@/lib/mock-data';

interface VehicleGalleryProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

/**
 * VehicleGallery Organismus-Komponente für den OpenCarBox Autohandel.
 * Zeigt eine Galerie von Fahrzeug-Karten mit Filter-Optionen.
 */
export function VehicleGallery({ vehicles, isLoading = false }: VehicleGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[500px] bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Keine Fahrzeuge gefunden</h3>
        <p className="text-slate-500">Bitte passen Sie Ihre Suchkriterien an.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          id={vehicle.id}
          title={`${vehicle.make} ${vehicle.model}`}
          slug={`${vehicle.make}-${vehicle.model}-${vehicle.id}`.toLowerCase().replace(/\s+/g, '-')}
          make={vehicle.make}
          model={vehicle.model}
          year={vehicle.year}
          mileage={vehicle.mileage}
          price={vehicle.price}
          fuelType={vehicle.fuel === 'Benzin' ? 'petrol' : vehicle.fuel === 'Diesel' ? 'diesel' : 'petrol'}
          transmission={vehicle.transmission === 'Automatik' ? 'automatic' : 'manual'}
          powerPs={150} // Placeholder - would come from API
          image={vehicle.images[0]}
        />
      ))}
    </div>
  );
}

export default VehicleGallery;