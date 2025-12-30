'use client';


import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';

/**
 * Kontaktseite - OpenCarBox & Carvantooo
 */
export default function KontaktPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-20 pb-32">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Lassen Sie uns <span className="text-gradient-red">sprechen</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Haben Sie Fragen zu unseren Services, Fahrzeugen oder Ersatzteilen?
              Unser Team ist für Sie da – persönlich, schnell und kompetent.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-premium p-8 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-carvantooo-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-carvantooo-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Telefon</h3>
                  <p className="text-sm text-slate-500 mb-2">Mo-Fr: 08:00 - 18:00</p>
                  <a href="tel:+43179813410" className="text-lg font-bold text-carvantooo-600 hover:text-carvantooo-700 transition-colors">
                    +43 1 798 134 10
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium p-8 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-opencarbox-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-opencarbox-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">E-Mail</h3>
                  <p className="text-sm text-slate-500 mb-2">Wir antworten innerhalb von 24h</p>
                  <a href="mailto:office@opencarbox.at" className="text-lg font-bold text-opencarbox-600 hover:text-opencarbox-700 transition-colors">
                    office@opencarbox.at
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card-premium p-8 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Standort</h3>
                  <p className="text-sm text-slate-500 mb-2">Besuchen Sie uns vor Ort</p>
                  <address className="not-italic font-bold text-slate-700">
                    Rennweg 76, 1030 Wien<br />Österreich
                  </address>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 card-premium p-10 bg-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Send className="w-40 h-40 text-carvantooo-500" />
              </div>

              <h2 className="text-3xl font-display font-bold mb-8">Nachricht senden</h2>

              <form className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Vor- & Nachname</label>
                    <input
                      type="text"
                      placeholder="Max Mustermann"
                      className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-5 font-medium outline-none focus:border-carvantooo-500 focus:ring-4 focus:ring-carvantooo-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">E-Mail Adresse</label>
                    <input
                      type="email"
                      placeholder="max@beispiel.at"
                      className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-5 font-medium outline-none focus:border-carvantooo-500 focus:ring-4 focus:ring-carvantooo-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Betreff</label>
                  <select className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 px-5 font-medium outline-none focus:border-carvantooo-500 focus:ring-4 focus:ring-carvantooo-500/10 transition-all appearance-none">
                    <option>Allgemeine Anfrage</option>
                    <option>Werkstatt-Termin</option>
                    <option>Ersatzteile-Shop</option>
                    <option>Fahrzeugkauf / Inzahlungnahme</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ihre Nachricht</label>
                  <textarea
                    placeholder="Wie können wir Ihnen helfen?"
                    rows={5}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-5 font-medium outline-none focus:border-carvantooo-500 focus:ring-4 focus:ring-carvantooo-500/10 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                  <p className="text-xs text-slate-400 max-w-xs">
                    Mit dem Absenden erklären Sie sich mit unserer
                    <a href="/datenschutz" className="text-carvantooo-500 font-bold hover:underline ml-1">Datenschutzerklärung</a> einverstanden.
                  </p>
                  <Button className="h-16 px-12 btn-gradient-red text-lg font-bold rounded-xl shadow-xl shadow-carvantooo-500/20 group">
                    Nachricht senden
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 card-premium p-1 bg-gradient-to-r from-carvantooo-500 to-opencarbox-500 rounded-3xl"
          >
            <div className="bg-slate-900 rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center text-success">
                  <MessageCircle className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Lieber per WhatsApp?</h3>
                  <p className="text-slate-400">Schreiben Sie uns direkt und unkompliziert. Wir antworten sofort.</p>
                </div>
              </div>
              <Button className="h-16 px-12 bg-success hover:bg-success/90 text-white text-xl font-bold rounded-xl shadow-xl shadow-success/20">
                WhatsApp Chat starten
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
