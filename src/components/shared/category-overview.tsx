/**
 * Category Overview Component - OpenCarBox & Carvantooo
 *
 * Übersicht der Hauptkategorien/Bereiche für die Landing Page.
 * Zeigt Shop, Werkstatt und Autohandel als interaktive Cards.
 *
 * @module components/shared/category-overview
 */

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    Car,
    ShoppingBag,
    Wrench
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

/**
 * Kategorie-Definition
 */
interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  brand: 'carvantooo' | 'opencarbox';
  image?: string;
  features: string[];
  cta: string;
}

/**
 * Standard-Kategorien
 */
const defaultCategories: Category[] = [
  {
    id: 'shop',
    title: 'Online Shop',
    description:
      'Premium Autoteile und Zubehör für alle Marken. Schnelle Lieferung und faire Preise.',
    icon: <ShoppingBag className="h-8 w-8" />,
    href: '/shop',
    brand: 'carvantooo',
    features: [
      'Über 100.000 Artikel',
      'Expressversand möglich',
      'Kostenlose Retoure',
    ],
    cta: 'Zum Shop',
  },
  {
    id: 'werkstatt',
    title: 'Werkstatt',
    description:
      'Professionelle KFZ-Werkstatt mit modernster Ausstattung. Von Inspektion bis Reparatur.',
    icon: <Wrench className="h-8 w-8" />,
    href: '/werkstatt',
    brand: 'opencarbox',
    features: [
      'Online Terminbuchung',
      'Alle Marken & Modelle',
      'Faire Festpreise',
    ],
    cta: 'Termin buchen',
  },
  {
    id: 'autohandel',
    title: 'Autohandel',
    description:
      'Geprüfte Gebrauchtwagen und Neuwagen. Faire Ankaufspreise und Finanzierungsoptionen.',
    icon: <Car className="h-8 w-8" />,
    href: '/autohandel',
    brand: 'opencarbox',
    features: [
      'Geprüfte Fahrzeuge',
      'Garantie inklusive',
      'Finanzierung möglich',
    ],
    cta: 'Fahrzeuge ansehen',
  },
];

/**
 * CategoryOverview Props
 */
interface CategoryOverviewProps {
  /**
   * Überschrift der Section
   */
  title?: string;
  /**
   * Untertitel
   */
  subtitle?: string;
  /**
   * Benutzerdefinierte Kategorien
   */
  categories?: Category[];
  /**
   * Layout-Variante
   */
  layout?: 'grid' | 'carousel';
  /**
   * Zusätzliche CSS-Klassen
   */
  className?: string;
}

/**
 * Category Card Component
 */
function CategoryCard({ category }: { category: Category }) {
  const isCarvantooo = category.brand === 'carvantooo';

  return (
    <Link
      href={category.href}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'bg-white border border-slate-200 shadow-sm',
        'transition-all duration-300',
        'hover:shadow-xl hover:border-transparent hover:-translate-y-1',
        isCarvantooo
          ? 'hover:shadow-carvantooo-500/20'
          : 'hover:shadow-opencarbox-500/20'
      )}
    >
      {/* Header mit Icon */}
      <div
        className={cn(
          'p-6 pb-4',
          isCarvantooo
            ? 'bg-gradient-to-br from-carvantooo-50 to-carvantooo-100/50'
            : 'bg-gradient-to-br from-opencarbox-50 to-opencarbox-100/50'
        )}
      >
        <div
          className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4',
            'transition-transform group-hover:scale-110',
            isCarvantooo
              ? 'bg-carvantooo-500 text-white'
              : 'bg-opencarbox-500 text-white'
          )}
        >
          {category.icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pt-2">
        <p className="text-slate-600 mb-4">{category.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {category.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-slate-600">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full mr-2',
                  isCarvantooo ? 'bg-carvantooo-500' : 'bg-opencarbox-500'
                )}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer CTA */}
      <div className="p-6 pt-0">
        <Button
          variant={isCarvantooo ? 'primary-red' : 'primary-blue'}
          className="w-full group/btn"
        >
          {category.cta}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Link>
  );
}

/**
 * CategoryOverview Component
 */
export function CategoryOverview({
  title = 'Unsere Leistungen',
  subtitle = 'Alles rund ums Auto aus einer Hand',
  categories = defaultCategories,
  layout = 'grid',
  className,
}: CategoryOverviewProps) {
  return (
    <section className={cn('py-16 md:py-24 bg-slate-50', className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Categories Grid */}
        <div
          className={cn(
            'grid gap-8',
            layout === 'grid' &&
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
          )}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryOverview;
