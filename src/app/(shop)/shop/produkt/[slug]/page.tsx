'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findFeaturedProductBySlug } from '@/lib/shop-products';
import {
    Check,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    Share2,
    ShieldCheck,
    Star,
    Truck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = React.use(params);
  const product = findFeaturedProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container-content py-16">
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-3">Produkt nicht gefunden</h1>
          <p className="text-slate-600 mb-6">
            Für den Slug "{slug}" wurde kein Produkt gefunden.
          </p>
          <Button asChild className="bg-carvantooo-500 hover:bg-carvantooo-600 text-white">
            <Link href="/shop">Zurück zum Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-content py-8">
       {/* Breadcrumb */}
       <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-carvantooo-500 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-carvantooo-500 transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/shop/kategorie/${product.category.toLowerCase()}`} className="hover:text-carvantooo-500 transition-colors">{product.category}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.discount > 0 && (
                   <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                     -{product.discount}%
                   </div>
                )}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-carvantooo-500 cursor-pointer transition-colors relative">
                         <Image
                          src={product.image}
                          alt={`${product.name} ${i}`}
                          fill
                          className="object-cover opacity-80 hover:opacity-100"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Info */}
        <div>
            <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-slate-500 border-slate-300">{product.brand}</Badge>
                {product.inStock && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Auf Lager</Badge>
                )}
            </div>

            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center text-yellow-400 gap-0.5">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                 </div>
                 <span className="text-sm text-slate-500 hover:text-carvantooo-500 cursor-pointer underline decoration-dotted underline-offset-2">{product.reviews} Bewertungen</span>
                 <span className="text-slate-300">|</span>
                 <span className="text-sm text-slate-500">Art.Nr.: 12345678</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                <div className="flex items-end gap-4 mb-2">
                    <span className="text-4xl font-bold text-slate-900">{product.price.toFixed(2)} €</span>
                    {product.originalPrice > product.price && (
                        <span className="text-lg text-slate-400 line-through mb-1">{product.originalPrice.toFixed(2)} €</span>
                    )}
                </div>
                <p className="text-xs text-slate-500 mb-6">inkl. 20% MwSt., zzgl. Versandkosten</p>

                <div className="flex gap-4 mb-4">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white h-12">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-full flex items-center justify-center hover:bg-slate-50 text-slate-600"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 h-full text-center border-x border-slate-300 focus:outline-none"
                        />
                         <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-full flex items-center justify-center hover:bg-slate-50 text-slate-600"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <Button size="xl" className="flex-1 bg-carvantooo-500 hover:bg-carvantooo-600 text-white font-bold rounded-lg shadow-lg shadow-carvantooo-500/20">
                        In den Warenkorb
                    </Button>
                </div>

                <div className="flex gap-4">
                   <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-white hover:border-carvantooo-500">
                      <Heart className="w-4 h-4 mr-2" /> Merken
                   </Button>
                   <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-white hover:border-carvantooo-500">
                      <Share2 className="w-4 h-4 mr-2" /> Teilen
                   </Button>
                </div>
            </div>

            {/* USPs */}
             <div className="space-y-4 border-t border-slate-200 pt-6">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900">Passt für Ihr Fahrzeug</p>
                        <p className="text-xs text-slate-500">VW Golf VII 2.0 TDI (150 PS)</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900">Schnelle Lieferung</p>
                        <p className="text-xs text-slate-500">Lieferung bis Mittwoch, 22.05.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-slate-900">2 Jahre Garantie</p>
                        <p className="text-xs text-slate-500">Volle Herstellergarantie inklusive</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
