import React from 'react';
import { getProductsByVehicle, searchProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/shop/product-card';
import { featuredProducts as mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Car, Zap } from 'lucide-react';

interface ProduktePageProps {
  searchParams: Promise<{
    q?: string;
    hsn?: string;
    tsn?: string;
    category?: string;
  }>;
}

export default async function ProduktePage({ searchParams }: ProduktePageProps) {
  const { q, hsn, tsn } = await searchParams;

  let products = [];
  let title = "Alle Produkte";
  let description = "Finden Sie die passenden Teile für Ihr Fahrzeug.";

  if (hsn && tsn) {
    products = await getProductsByVehicle(hsn, tsn);
    title = `Teile für HSN: ${hsn} / TSN: ${tsn}`;
    description = `Wir haben ${products.length} passende Teile für Ihr Fahrzeug gefunden.`;
  } else if (q) {
    products = await searchProducts(q);
    title = `Suchergebnisse für "${q}"`;
    description = `Wir haben ${products.length} Produkte zu Ihrer Suche gefunden.`;
  } else {
    // Fallback if no search
    products = await searchProducts(''); // Get all active
  }

  // Fallback to mock data if nothing found (for dev/preview)
  const displayProducts = products.length > 0
    ? products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        slug: p.slug,
        rating: 4.8,
        reviewsCount: 124
      }))
    : mockProducts.slice(0, 4).map(p => ({
        id: p.id.toString(),
        name: p.name,
        brand: p.brand,
        price: p.price,
        comparePrice: p.originalPrice,
        images: p.image,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        rating: p.rating,
        reviewsCount: p.reviews
      }));

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-content">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary-500 font-bold text-sm mb-2">
              <Car className="w-4 h-4" />
              <span>Fahrzeugspezifische Suche</span>
            </div>
            <h1 className="text-4xl font-display font-black text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-500">{description}</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-xl font-bold flex-1 md:flex-none">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Suchen..." className="pl-10 rounded-xl" defaultValue={q} />
            </div>
          </div>
        </div>

        {products.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-800 font-bold mb-1">Hinweis zur Vorschau</p>
              <p className="text-amber-700 text-sm">
                Da die Datenbank noch keine Produkte enthält, zeigen wir Ihnen hier Beispielprodukte an.
                Sobald der Produktimport abgeschlossen ist, werden hier die echten Daten angezeigt.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
