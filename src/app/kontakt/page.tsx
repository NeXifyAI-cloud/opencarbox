"use client";

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { companyConfig } from '@/config/company';
import { motion } from 'framer-motion';
import {
  Info,
  Mail,
  MapPin,
  Phone,
  Send
} from 'lucide-react';
import Image from "next/image";
import { useState } from 'react';

/**
 * Kontaktseite - OpenCarBox Autohandel
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
              className="object-cover opacity-20"
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
              Haben Sie Fragen zu einem Fahrzeug oder möchten Sie einen Termin in unserer Werkstatt vereinbaren? Wir sind für Sie da.
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="p-1 bg-ocb-orange"></div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Senden Sie uns eine Nachricht</h2>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <button
                      onClick={() => setInquiryType('kauf')}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${inquiryType === 'kauf' ? 'bg-ocb-orange text-black' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      Fahrzeuganfrage
                    </button>
                    <button
                      onClick={() => setInquiryType('service')}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${inquiryType === 'service' ? 'bg-ocb-orange text-black' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      Werkstatt-Termin
                    </button>
                    <button
                      onClick={() => setInquiryType('allgemein')}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${inquiryType === 'allgemein' ? 'bg-ocb-orange text-black' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      Allgemeine Frage
                    </button>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="firstname">Vorname</label>
                        <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="firstname" placeholder="Ihr Vorname" type="text" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="lastname">Nachname</label>
                        <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="lastname" placeholder="Ihr Nachname" type="text" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">E-Mail Adresse</label>
                        <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="email" placeholder="beispiel@mail.de" type="email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="phone">Telefonnummer (Optional)</label>
                        <input className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-ocb-orange focus:border-transparent transition-shadow outline-none" id="phone" placeholder="+43 664 ..." type="tel" />
                      </div>
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
