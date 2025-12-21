'use client';

import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Wrench, Clock, ShieldCheck, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
            <Badge variant="opencarbox" className="mb-6 px-4 py-1.5 text-sm font-bold">
              OpenCarBox Meisterbetrieb
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              Meisterlicher <span className="text-opencarbox-500">Service</span> für Ihr Auto
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
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
      <section className="py-12 bg-white border-b relative z-10">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Garantie erhalten</h3>
                <p className="text-sm text-slate-500 max-w-[250px]">Wartung streng nach Herstellervorgaben für vollen Garantieerhalt.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Modernste Technik</h3>
                <p className="text-sm text-slate-500 max-w-[250px]">Präzise Diagnose mit aktuellster Hard- und Software.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-opencarbox-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-opencarbox-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Höchste Qualität</h3>
                <p className="text-sm text-slate-500 max-w-[250px]">Verwendung von Originalteilen oder Erstausrüsterqualität.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget Section */}
      <section className="py-24 container-content">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Schnell & einfach zum <span className="text-opencarbox-500">Wunschtermin</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Wählen Sie Ihren gewünschten Service, Ihr Fahrzeug und finden Sie in Echtzeit
              einen passenden Termin in unserer Werkstatt.
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Service wählen', desc: 'Ölwechsel, Inspektion, Bremsen...' },
                { title: 'Zeit wählen', desc: 'Alle freien Slots auf einen Blick' },
                { title: 'Bestätigung erhalten', desc: 'Sofort per E-Mail & WhatsApp' },
              ].map((step, idx) => (
                <li key={step.title} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-opencarbox-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-opencarbox-500/20 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-slate-500">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-premium p-10 bg-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calendar className="w-32 h-32 text-opencarbox-500" />
            </div>

            <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-opencarbox-500" />
              Termin anfragen
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Leistung wählen</label>
                <div className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 text-slate-400 font-medium cursor-pointer hover:border-opencarbox-500 transition-colors">
                  Bitte wählen Sie eine Leistung...
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Fahrzeug (HSN/TSN)</label>
                <input
                  type="text"
                  placeholder="z.B. 0603 / BDE"
                  className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-medium outline-none focus:border-opencarbox-500 focus:ring-4 focus:ring-opencarbox-500/10 transition-all"
                />
              </div>

              <Button className="w-full h-14 btn-gradient-blue text-lg font-bold rounded-xl shadow-lg shadow-opencarbox-500/20">
                Verfügbarkeit prüfen
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 pt-4 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Blitz-Antwort
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1.5 text-success">
                  <ShieldCheck className="w-3 h-3" /> SSL Verschlüsselt
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
