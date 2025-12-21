'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Wrench, Clock, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * OpenCarBox Werkstatt Landing Page
 */
export default function WerkstattPage() {
  return (
    <div className="pb-20">
      {/* Service Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue opacity-30" />
        <div className="container-content relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
              Meisterlicher <span className="text-opencarbox-500">Service</span> für Ihr Auto
            </h1>
            <p className="text-xl text-slate-400 mb-12">
              Von der Inspektion nach Herstellervorgaben bis zur komplexen Reparatur.
              Wir sorgen dafür, dass Ihr Fahrzeug sicher auf der Straße bleibt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn-gradient-blue h-16 px-10 text-xl font-bold rounded-xl shadow-lg shadow-opencarbox-500/20">
                Termin online buchen
              </Button>
              <Button variant="outline" className="h-16 px-10 text-xl font-bold border-white/20 hover:bg-white/10 text-white rounded-xl">
                Unsere Leistungen
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-b">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Garantie erhalten</h3>
                <p className="text-sm text-slate-500">Wartung streng nach Herstellervorgaben für vollen Garantieerhalt.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center">
                <Wrench className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Modernste Technik</h3>
                <p className="text-sm text-slate-500">Präzise Diagnose mit aktuellster Hard- und Software.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center">
                <Star className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Höchste Qualität</h3>
                <p className="text-sm text-slate-500">Verwendung von Originalteilen oder Erstausrüsterqualität.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget Placeholder */}
      <section className="py-24 container-content">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-6">Schnell & einfach zum <span className="text-opencarbox-500">Wunschtermin</span></h2>
            <p className="text-lg text-slate-600 mb-10">
              Wählen Sie Ihren gewünschten Service, Ihr Fahrzeug und finden Sie in Echtzeit
              einen passenden Termin in unserer Werkstatt.
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Service wählen', desc: 'Ölwechsel, Inspektion, Bremsen...' },
                { title: 'Zeit wählen', desc: 'Alle freien Slots auf einen Blick' },
                { title: 'Bestätigung erhalten', desc: 'Sofort per E-Mail & WhatsApp' },
              ].map((step, idx) => (
                <li key={step.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-opencarbox-500 text-white flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-premium p-10 bg-white shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4">
              <Calendar className="w-12 h-12 text-opencarbox-100" />
            </div>
            <h3 className="text-2xl font-bold mb-8">Termin anfragen</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Leistung</label>
                <div className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Fahrzeug (HSN/TSN)</label>
                <div className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50" />
              </div>
              <Button className="w-full h-14 btn-gradient-blue text-lg font-bold">
                Verfügbarkeit prüfen
              </Button>
              <p className="text-center text-xs text-slate-400">
                <Clock className="inline-block w-3 h-3 mr-1" />
                Antwort in der Regel innerhalb von 15 Minuten
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
