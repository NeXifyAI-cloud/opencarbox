import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/shared/hero';
import { CategoryOverview } from '@/components/shared/category-overview';
import { Phone, Mail } from 'lucide-react';

/**
 * Homepage - OpenCarBox & Carvantooo
 *
 * Überarbeitete Landing Page mit Premium Automotive Design.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Premium Hero Section */}
        <Hero />

        {/* Bereichsübersicht */}
        <CategoryOverview />

        {/* Premium CTA Section */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          {/* Dekorative Elemente */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-carvantooo-500 via-opencarbox-500 to-carvantooo-500" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-opencarbox-500/10 rounded-full blur-3xl" />

          <div className="container-content relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              Bereit für erstklassigen Service?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              Ob Sie Teile suchen, einen Werkstatt-Termin brauchen oder ein neues Auto –
              unser Team steht Ihnen mit Expertise zur Seite.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/kontakt"
                className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
              >
                Kontakt aufnehmen
              </a>

              <div className="flex items-center gap-6">
                <a href="tel:+43179813410" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-opencarbox-500 transition-colors">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Rufen Sie uns an</div>
                    <div className="text-lg font-bold">+43 1 798 134 10</div>
                  </div>
                </a>

                <a href="mailto:office@opencarbox.at" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-carvantooo-500 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Schreiben Sie uns</div>
                    <div className="text-lg font-bold">office@opencarbox.at</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
