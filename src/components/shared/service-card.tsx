import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ChevronRight, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from './price-display';

/**
 * Service-Daten Interface
 */
interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  priceFrom?: boolean;
  duration?: string;
  image?: string;
  category?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

/**
 * Props für die ServiceCard-Komponente
 */
interface ServiceCardProps {
  /** Service-Daten */
  service: Service;
  /** Callback bei Termin-Buchung */
  onBookAppointment?: (service: Service) => void;
  /** Layout-Variante */
  variant?: 'default' | 'compact' | 'featured';
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * ServiceCard-Komponente für Werkstatt-Services.
 *
 * @example
 * <ServiceCard
 *   service={service}
 *   onBookAppointment={(s) => openBooking(s.id)}
 *   variant="featured"
 * />
 */
export function ServiceCard({
  service,
  onBookAppointment,
  variant = 'default',
  className,
}: ServiceCardProps) {
  const serviceUrl = `/werkstatt/services/${service.slug}`;

  // Featured Variante (groß, mit Bild)
  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-2xl',
          'transition-all duration-300',
          'hover:shadow-2xl hover:shadow-opencarbox-500/10',
          className
        )}
      >
        {/* Hintergrund-Bild */}
        <div className="absolute inset-0">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-opencarbox-500 to-opencarbox-700" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex min-h-[300px] flex-col justify-end p-6 text-white">
          {/* Badges */}
          <div className="mb-4 flex gap-2">
            {service.isPopular && (
              <Badge variant="opencarbox">Beliebt</Badge>
            )}
            {service.isNew && (
              <Badge variant="secondary">Neu</Badge>
            )}
          </div>

          {/* Titel & Beschreibung */}
          <h3 className="mb-2 text-2xl font-bold">{service.name}</h3>
          {service.description && (
            <p className="mb-4 text-white/80 line-clamp-2">
              {service.description}
            </p>
          )}

          {/* Meta & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {service.price && (
                <span className="text-xl font-bold">
                  {service.priceFrom && 'ab '}
                  {new Intl.NumberFormat('de-AT', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(service.price)}
                </span>
              )}
              {service.duration && (
                <span className="flex items-center gap-1 text-sm text-white/70">
                  <Clock className="h-4 w-4" />
                  {service.duration}
                </span>
              )}
            </div>

            <Button
              variant="opencarbox"
              onClick={() => onBookAppointment?.(service)}
            >
              Termin buchen
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Compact Variante
  if (variant === 'compact') {
    return (
      <Link
        href={serviceUrl}
        className={cn(
          'group flex items-center gap-3 rounded-lg border bg-card p-3',
          'transition-all duration-200',
          'hover:border-opencarbox-300 hover:bg-opencarbox-50/50',
          className
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-opencarbox-100 text-opencarbox-600">
          <Wrench className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-foreground group-hover:text-opencarbox-600">
            {service.name}
          </h4>
          {service.price && (
            <span className="text-sm text-muted-foreground">
              {service.priceFrom && 'ab '}
              {new Intl.NumberFormat('de-AT', {
                style: 'currency',
                currency: 'EUR',
              }).format(service.price)}
            </span>
          )}
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-opencarbox-500" />
      </Link>
    );
  }

  // Default Variante
  return (
    <div
      className={cn(
        'group flex flex-col rounded-xl border bg-card',
        'transition-all duration-300',
        'hover:shadow-lg hover:shadow-opencarbox-500/10',
        className
      )}
    >
      {/* Bild */}
      <Link
        href={serviceUrl}
        className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-muted"
      >
        {service.image ? (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-opencarbox-100 to-opencarbox-200">
            <Wrench className="h-12 w-12 text-opencarbox-500" />
          </div>
        )}

        {/* Badges */}
        {(service.isPopular || service.isNew) && (
          <div className="absolute left-3 top-3 flex gap-2">
            {service.isPopular && (
              <Badge variant="opencarbox">Beliebt</Badge>
            )}
            {service.isNew && (
              <Badge>Neu</Badge>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Kategorie */}
        {service.category && (
          <span className="mb-1 text-xs text-muted-foreground">
            {service.category}
          </span>
        )}

        {/* Titel */}
        <Link href={serviceUrl}>
          <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-opencarbox-600">
            {service.name}
          </h3>
        </Link>

        {/* Beschreibung */}
        {service.description && (
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t">
          <div>
            {service.price && (
              <PriceDisplay
                price={service.price}
                showFrom={service.priceFrom}
                size="sm"
              />
            )}
            {service.duration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {service.duration}
              </span>
            )}
          </div>

          <Button
            variant="opencarbox"
            size="sm"
            onClick={() => onBookAppointment?.(service)}
          >
            Buchen
          </Button>
        </div>
      </div>
    </div>
  );
}

