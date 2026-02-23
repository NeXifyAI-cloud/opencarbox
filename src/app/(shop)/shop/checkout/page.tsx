'use client';

import React from 'react';
import { useCartStore } from '@/lib/shop/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Warenkorb ist leer</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider text-sm">Versandadresse</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Vorname" className="h-12" />
                <Input placeholder="Nachname" className="h-12" />
                <Input placeholder="Straße und Hausnummer" className="h-12 col-span-2" />
                <Input placeholder="PLZ" className="h-12" />
                <Input placeholder="Stadt" className="h-12" />
                <Input placeholder="E-Mail Adresse" className="h-12 col-span-2" />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider text-sm">Zahlung</h2>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <p className="text-slate-500 text-sm mb-4">Wähle deine bevorzugte Zahlungsmethode:</p>
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-white rounded-xl border-2 border-primary-500 gap-4 cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-4 border-primary-500" />
                    <span className="font-bold text-slate-900">Kreditkarte (Stripe)</span>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl border border-slate-200 gap-4 cursor-not-allowed opacity-50">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                    <span className="font-bold text-slate-900">PayPal (Demnächst)</span>
                  </div>
                </div>
              </div>
            </section>

            <Button variant="gradient-primary" size="xl" className="w-full rounded-2xl shadow-xl shadow-primary-500/20 font-bold h-16 text-lg">
              Jetzt zahlungspflichtig bestellen
            </Button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              Deine Daten sind 256-Bit SSL verschlüsselt
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:pl-16 lg:border-l border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-8">Bestellübersicht</h2>
            <div className="space-y-6 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-slate-400">
                      {item.quantity}x
                    </div>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 space-y-4">
              <div className="flex justify-between text-slate-500">
                <span>Zwischensumme</span>
                <span>{getTotalPrice().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Versandkosten</span>
                <span className="text-emerald-500 font-bold">0.00 €</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between text-2xl font-display font-bold text-slate-900">
                <span>Gesamt</span>
                <span className="text-primary-500">{getTotalPrice().toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
