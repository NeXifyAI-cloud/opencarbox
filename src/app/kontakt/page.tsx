'use client';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { companyConfig } from '@/config/company';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowRight,
  Car,
  Coins,
  Handshake,
  Info,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  ShoppingCart,
  Wrench
} from 'lucide-react';
import { useState } from 'react';

/**
 * Kontaktseite - OpenCarBox Autohandel
 * Implementiert das Design aus Codebeispiel 001
 */
export default function KontaktPage() {
  const [inquiryType, setInquiryType] = useState('kauf');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-slate-900 overflow-hidden min-h-[300px] flex items-center">
          <div className="absolute inset-0">
            <Image
              alt="Car showroom interior background"
              className="w-full h-full object-cover opacity-20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFhqg0HylnWFzV31qF5NyjqvFlmpzSDfJOZpzEkqIC2xxq2oOQ1h97m17lUyd2Km9Lf8gcR8aIMtCF9P8nqA_g5g2rG8-s3Ih2RlTC8zHPnM_xkvBFQcrvZkrIa6Z8fbd4sHnyzlfWvRMvFEJLHQjFVtl0uT9DJHlU_HmtEKwj5qVGJ0VNgDc5xzd2pHon6iPyDJlMIwa9_FR-GWxpNfc51xyNubXfIc6DjTPuoNvC_k8NOreFrg3At7WZV9KoFdKh7nSP4X_AQzQ"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
            >
              Kontaktieren Sie <span className="text-ocb-orange">OpenCarBox</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-2xl"
            >
              Wir stehen Ihnen für Fragen zu Fahrzeugkauf, Finanzierung oder Probefahrten jederzeit zur Verfügung.
            </motion.p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl shadow-xl border border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Senden Sie uns eine Anfrage</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">Worum geht es?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Kaufanfrage */}
                      <label
                        className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:border-ocb-orange transition-all group ${inquiryType === 'kauf' ? 'border-ocb-orange bg-ocb-orange/5 dark:bg-ocb-orange/10' : 'border-border'}`}
                      >
                        <input
                          type="radio"
                          name="inquiry_type"
                          value="kauf"
                          className="sr-only"
                          checked={inquiryType === 'kauf'}
                          onChange={() => setInquiryType('kauf')}
                        />
                        <div className="text-center">
                          <ShoppingCart className={`w-8 h-8 mx-auto mb-2 ${inquiryType === 'kauf' ? 'text-ocb-orange' : 'text-muted-foreground group-hover:text-ocb-orange'}`} />
                          <span className="block text-sm font-medium">Kaufanfrage</span>
                        </div>
                      </label>

                      {/* Probefahrt */}
                      <label
                        className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:border-ocb-orange transition-all group ${inquiryType === 'probefahrt' ? 'border-ocb-orange bg-ocb-orange/5 dark:bg-ocb-orange/10' : 'border-border'}`}
                      >
                        <input
                          type="radio"
                          name="inquiry_type"
                          value="probefahrt"
                          className="sr-only"
                          checked={inquiryType === 'probefahrt'}
                          onChange={() => setInquiryType('probefahrt')}
                        />
                        <div className="text-center">
                          <Car className={`w-8 h-8 mx-auto mb-2 ${inquiryType === 'probefahrt' ? 'text-ocb-orange' : 'text-muted-foreground group-hover:text-ocb-orange'}`} />
                          <span className="block text-sm font-medium">Probefahrt</span>
                        </div>
                      </label>

                      {/* Finanzierung */}
                      <label
                        className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:border-ocb-orange transition-all group ${inquiryType === 'finanzierung' ? 'border-ocb-orange bg-ocb-orange/5 dark:bg-ocb-orange/10' : 'border-border'}`}
                      >
                        <input
                          type="radio"
                          name="inquiry_type"
                          value="finanzierung"
                          className="sr-only"
                          checked={inquiryType === 'finanzierung'}
                          onChange={() => setInquiryType('finanzierung')}
                        />
                        <div className="text-center">
                          <Landmark className={`w-8 h-8 mx-auto mb-2 ${inquiryType === 'finanzierung' ? 'text-ocb-orange' : 'text-muted-foreground group-hover:text-ocb-orange'}`} />
                          <span className="block text-sm font-medium">Finanzierung</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="firstname">Vorname</label>
                      <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="firstname" placeholder="Max" type="text" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="lastname">Nachname</label>
                      <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="lastname" placeholder="Mustermann" type="text" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">E-Mail Adresse</label>
                      <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="email" placeholder="max.mustermann@example.com" type="email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">Telefonnummer</label>
                      <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="phone" placeholder="+43 664 1234567" type="tel" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="vehicle_interest">Fahrzeug (Optional)</label>
                    <select className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none appearance-none" id="vehicle_interest">
                      <option value="">Bitte wählen...</option>
                      <option value="BMW 320d">BMW 320d xDrive - € 28.900</option>
                      <option value="Mercedes C 220d">Mercedes C 220d - € 32.500</option>
                      <option value="Audi A5">Audi A5 Sportback - € 36.990</option>
                      <option value="VW Golf">VW Golf VIII GTI - € 38.450</option>
                      <option value="Porsche Macan">Porsche Macan - € 54.900</option>
                      <option value="Tesla Model 3">Tesla Model 3 - € 41.500</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">Ihre Nachricht</label>
                    <textarea className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none min-h-[120px]" id="message" placeholder="Wie können wir Ihnen weiterhelfen?" rows={4}></textarea>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input className="w-4 h-4 text-ocb-orange border-border rounded focus:ring-ocb-orange bg-muted" id="privacy" type="checkbox" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium" htmlFor="privacy">Datenschutz</label>
                      <p className="text-muted-foreground">Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden.</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-ocb-orange hover:bg-ocb-orange-hover text-black font-bold text-lg py-6 rounded-xl transition-all shadow-lg hover:shadow-ocb-orange/20 flex items-center justify-center gap-2"
                      type="submit"
                    >
                      <Send className="w-5 h-5" />
                      Anfrage absenden
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Info Card */}
              <div className="bg-card rounded-xl shadow-md border border-border p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-ocb-orange/20 flex items-center justify-center text-ocb-orange">
                    <Info className="w-4 h-4" />
                  </span>
                  Kontaktdaten
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-ocb-orange">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Adresse</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {companyConfig.legalName}<br />
                        {companyConfig.address.street}<br />
                        {companyConfig.address.zip} {companyConfig.address.city}, {companyConfig.address.country}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-ocb-orange">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Telefon</p>
                      <a className="text-muted-foreground text-sm mt-1 hover:text-ocb-orange transition-colors block" href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                        {companyConfig.contact.phone}
                      </a>
                      <span className="text-xs text-muted-foreground">(Mo-Fr 08:00-18:00)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-ocb-orange">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">E-Mail</p>
                      <a className="text-muted-foreground text-sm mt-1 hover:text-ocb-orange transition-colors block" href={`mailto:${companyConfig.contact.email}`}>
                        {companyConfig.contact.email}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map Card */}
              <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold">Hier finden Sie uns</h3>
                </div>
                <div className="h-64 w-full bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <iframe
                      frameBorder="0"
                      height="100%"
                      marginHeight={0}
                      marginWidth={0}
                      scrolling="no"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=16.380000%2C48.180000%2C16.400000%2C48.200000&layer=mapnik&marker=48.190000%2C16.390000"
                      style={{ filter: 'grayscale(1) invert(0) contrast(0.8) opacity(0.8)' }}
                      width="100%"
                    ></iframe>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="relative">
                      <MapPin className="w-12 h-12 text-ocb-orange drop-shadow-md fill-ocb-orange/20" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted text-xs text-center text-muted-foreground">
                  <a className="hover:text-ocb-orange underline" href="https://www.openstreetmap.org/?mlat=48.19000&mlon=16.39000#map=15/48.1900/16.3900" target="_blank" rel="noopener noreferrer">
                    Größere Karte anzeigen
                  </a>
                </div>
              </div>

              {/* Werkstatt CTA Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden border border-slate-700">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Werkstatt Service?</h4>
                  <p className="text-slate-300 text-sm mb-4">Vereinbaren Sie direkt einen Termin in unserer Fachwerkstatt.</p>
                  <a className="inline-flex items-center text-sm font-semibold text-ocb-orange hover:text-white transition-colors" href="/werkstatt">
                    Zum Werkstatt-Formular <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  <Wrench className="w-32 h-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Section */}
        <div className="bg-card border-y border-border py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-ocb-orange/10 rounded-full flex items-center justify-center text-ocb-orange mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Geprüfte Qualität</h3>
                <p className="text-sm text-muted-foreground">Jedes Fahrzeug durchläuft einen strengen 120-Punkte Check in unserer Werkstatt.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-ocb-orange/10 rounded-full flex items-center justify-center text-ocb-orange mb-4">
                  <Coins className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Faire Finanzierung</h3>
                <p className="text-sm text-muted-foreground">Maßgeschneiderte Leasing- und Kreditangebote direkt bei uns im Haus.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-ocb-orange/10 rounded-full flex items-center justify-center text-ocb-orange mb-4">
                  <Handshake className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Inzahlungnahme</h3>
                <p className="text-sm text-muted-foreground">Wir kaufen Ihr altes Auto zu einem fairen Marktpreis an – unkompliziert.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-ocb-orange/10 rounded-full flex items-center justify-center text-ocb-orange mb-4">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Eigene Werkstatt</h3>
                <p className="text-sm text-muted-foreground">Service, §57a und Reparaturen auch nach dem Kauf direkt bei uns.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
