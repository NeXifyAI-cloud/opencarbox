'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/shop/cart-store';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 rounded-3xl p-12 max-w-2xl mx-auto border-2 border-dashed border-slate-200">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Dein Warenkorb ist leer</h1>
          <p className="text-slate-500 mb-8">Es scheint, als hättest du noch keine Produkte in deinen Warenkorb gelegt.</p>
          <Link href="/shop">
            <Button variant="gradient-primary" size="lg" className="rounded-xl px-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-slate-900 mb-8">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                <p className="text-primary-600 font-bold mb-4">{item.price.toFixed(2)} €</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-slate-50 text-slate-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Entfernen
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-24">
            <h2 className="text-2xl font-display font-bold mb-6">Zusammenfassung</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Artikel ({getTotalItems()})</span>
                <span>{getTotalPrice().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Versand</span>
                <span className="text-emerald-400 font-medium">Kostenlos</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between text-xl font-bold">
                <span>Gesamtsumme</span>
                <span className="text-primary-500">{getTotalPrice().toFixed(2)} €</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Inkl. 20% MwSt.</p>
            </div>

            <Link href="/shop/checkout">
              <Button variant="gradient-primary" size="xl" className="w-full rounded-2xl shadow-xl shadow-primary-500/20 group font-bold">
                Zur Kasse gehen
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
              {['VISA', 'Mastercard', 'PayPal'].map(p => (
                <span key={p} className="text-[10px] font-black tracking-tighter border border-white/20 px-2 py-1 rounded">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
