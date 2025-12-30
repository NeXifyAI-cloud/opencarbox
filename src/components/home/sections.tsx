'use client';

import { featuredProducts } from '@/lib/mock-data';
import { ArrowRight, Car, ShoppingBag, Star, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function PlatformOverview() {
  return (
    <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Shop Teaser */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <ShoppingBag className="h-10 w-10 text-[#1e3a5f] mb-4 relative z-10" />
        <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Teile & Zubehör</h3>
        <p className="text-gray-600 text-sm mb-4 relative z-10">
          Über 3 Millionen Ersatzteile für alle Marken. Top-Qualität zu fairen Preisen.
        </p>
        <Link href="/kategorien" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Zum Shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Workshop Teaser */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <Wrench className="h-10 w-10 text-[#4fd1c5] mb-4 relative z-10" />
        <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Werkstatt-Service</h3>
        <p className="text-gray-600 text-sm mb-4 relative z-10">
          Montage, Wartung und Reparatur. Buchen Sie Ihren Termin direkt online.
        </p>
        <Link href="/werkstatt" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Termin vereinbaren <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Dealership Teaser */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <Car className="h-10 w-10 text-[#1e3a5f] mb-4 relative z-10" />
        <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Fahrzeugmarkt</h3>
        <p className="text-gray-600 text-sm mb-4 relative z-10">
          Geprüfte Gebraucht- und Neuwagen. Finden Sie Ihr Traumauto bei uns.
        </p>
        <Link href="/fahrzeuge" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Fahrzeuge ansehen <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Top Angebote</h2>
        <Link
          href="/angebote"
          className="text-[#4fd1c5] hover:text-[#38b2ac] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Alle Angebote <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {featuredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/produkt/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#4fd1c5]/30 transition-all duration-300">
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{product.discount}%
                </div>
              )}

              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                <h3 className="text-sm font-medium text-[#1e3a5f] line-clamp-2 group-hover:text-[#4fd1c5] transition-colors mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#1e3a5f]">{product.price.toFixed(2)} €</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TopBrands() {
  const brands = [
    { id: 'bosch', name: 'BOSCH' },
    { id: 'ate', name: 'ATE' },
    { id: 'brembo', name: 'Brembo' },
    { id: 'mann', name: 'MANN-FILTER' },
    { id: 'liquimoly', name: 'LIQUI MOLY' },
    { id: 'skf', name: 'SKF' },
    { id: 'luk', name: 'LuK' },
    { id: 'valeo', name: 'Valeo' },
  ];

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Top Marken</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/marke/${brand.id}`}
              className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#4fd1c5]/10 transition-colors"
            >
              <span className="text-sm font-bold text-[#1e3a5f]">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SEOContent() {
  return (
    <section className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">
        Carvantooo - Die OpenCarBox Plattform
      </h2>
      <div className="prose prose-sm max-w-none text-gray-600">
        <p className="mb-4">
          Carvantooo ist mehr als nur ein Online-Shop. Als Teil der OpenCarBox Plattform bieten wir Ihnen
          ein ganzheitliches Erlebnis rund um Ihr Auto. Von hochwertigen Ersatzteilen über professionelle
          Werkstatt-Services bis hin zum Fahrzeugkauf - alles aus einer Hand.
        </p>

        <h3 className="text-lg font-semibold text-[#1e3a5f] mt-6 mb-3">
          Ein Ökosystem für Ihre Mobilität
        </h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Shop:</strong> Große Auswahl und niedrige Preise für 3 Mio. Teile</li>
          <li><strong>Werkstatt:</strong> Kompetente Meisterbetriebe für Einbau und Wartung</li>
          <li><strong>Handel:</strong> Zertifizierte Fahrzeuge mit Garantie</li>
        </ul>
      </div>
    </section>
  );
}
