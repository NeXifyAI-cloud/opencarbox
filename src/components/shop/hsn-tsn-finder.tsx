'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTracking } from '@/hooks/use-tracking';

export function HsnTsnFinder() {
  const [hsn, setHsn] = useState('');
  const [tsn, setTsn] = useState('');
  const router = useRouter();
  const { track } = useTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tracking
    track('hsn_tsn_lookup', { hsn, tsn });

    // Navigate
    const params = new URLSearchParams();
    params.set('hsn', hsn);
    params.set('tsn', tsn);
    router.push(`/shop/produkte?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex border-b">
        <button className="flex-1 py-4 text-sm font-bold border-b-2 border-primary-500 text-slate-900 flex items-center justify-center gap-2">
          <Search className="w-4 h-4 text-primary-500" /> HSN/TSN Suche
        </button>
        <button type="button" className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 bg-slate-50">
          <ChevronRight className="w-4 h-4" /> Fahrzeug wählen
        </button>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">HSN (2.1)</label>
              <Input
                placeholder="z.B. 0603"
                className="h-12 text-lg font-mono uppercase"
                maxLength={4}
                required
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">TSN (2.2)</label>
              <Input
                placeholder="z.B. ADO"
                className="h-12 text-lg font-mono uppercase"
                maxLength={3}
                required
                value={tsn}
                onChange={(e) => setTsn(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-4 mb-6 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Sie finden diese Nummern in Ihrem Fahrzeugschein im mittleren Teil unter 2.1 und 2.2.
              </p>
            </div>
          </div>

          <Button type="submit" variant="gradient-primary" size="xl" className="w-full rounded-xl shadow-lg shadow-primary-500/20 group">
            Passende Teile finden
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
}
