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
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-opencarbox-500 text-white font-medium hover:bg-opencarbox-600 transition-all hover:scale-105"
            >
              <span>🔧</span>
              <span>Werkstatt-Service</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            <a
              href="/fahrzeuge"
              className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-opencarbox-500 text-opencarbox-600 font-medium hover:bg-opencarbox-50 transition-all hover:scale-105"
            >
              <span>🚙</span>
              <span>Fahrzeuge</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-slate-400 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Drei Bereiche Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-content">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
              Alles aus einer Hand
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Egal ob Teile, Service oder Fahrzeugkauf – wir sind Ihr zuverlässiger Partner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Shop Card */}
            <div className="card-premium p-8 border-t-4 border-t-carvantooo-500">
              <div className="w-16 h-16 rounded-2xl bg-carvantooo-100 flex items-center justify-center text-3xl mb-6">
                🛒
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                Carvantooo Shop
              </h3>
              <p className="text-slate-600 mb-6">
                Premium Autoteile online bestellen. Mit HSN/TSN-Suche finden Sie
                garantiert passende Teile für Ihr Fahrzeug.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-carvantooo-500">✓</span>
                  Über 100.000 Teile
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-carvantooo-500">✓</span>
                  Schnelle Lieferung
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-carvantooo-500">✓</span>
                  Sichere Bezahlung
                </li>
              </ul>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 text-carvantooo-600 font-semibold hover:text-carvantooo-700 link-underline"
              >
                Zum Shop →
              </a>
            </div>

            {/* Werkstatt Card */}
            <div className="card-premium p-8 border-t-4 border-t-opencarbox-500">
              <div className="w-16 h-16 rounded-2xl bg-opencarbox-100 flex items-center justify-center text-3xl mb-6">
                🔧
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                OpenCarBox Werkstatt
              </h3>
              <p className="text-slate-600 mb-6">
                Professioneller KFZ-Service von Experten. Inspektion, Reparatur,
                Reifenwechsel und mehr – alles nach Herstellervorgaben.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Meisterbetrieb
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Online-Terminbuchung
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Faire Preise
                </li>
              </ul>
              <a
                href="/werkstatt"
                className="inline-flex items-center gap-2 text-opencarbox-600 font-semibold hover:text-opencarbox-700 link-underline"
              >
                Services ansehen →
              </a>
            </div>

            {/* Autohandel Card */}
            <div className="card-premium p-8 border-t-4 border-t-opencarbox-500">
              <div className="w-16 h-16 rounded-2xl bg-opencarbox-100 flex items-center justify-center text-3xl mb-6">
                🚙
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                OpenCarBox Autohandel
              </h3>
              <p className="text-slate-600 mb-6">
                Geprüfte Gebrauchtwagen und Neuwagen. Transparente Beratung,
                faire Finanzierung und umfassende Garantie.
              </p>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Geprüfte Fahrzeuge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Finanzierungsoptionen
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-opencarbox-500">✓</span>
                  Inzahlungnahme möglich
                </li>
              </ul>
              <a
                href="/fahrzeuge"
                className="inline-flex items-center gap-2 text-opencarbox-600 font-semibold hover:text-opencarbox-700 link-underline"
              >
                Fahrzeuge entdecken →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-opencarbox text-white">
        <div className="container-content text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Bereit loszulegen?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Ob Sie Teile suchen, einen Service-Termin brauchen oder ein neues Auto –
            wir sind für Sie da.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/kontakt"
              className="px-8 py-4 rounded-lg bg-white text-opencarbox-600 font-semibold hover:bg-slate-100 transition-all hover:scale-105"
            >
              Kontakt aufnehmen
            </a>
            <a
              href="tel:+43179813410"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all"
            >
              📞 +43 1 798 134 10
            </a>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container-content text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} OpenCarBox GmbH. Alle Rechte vorbehalten.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Rennweg 76, 1030 Wien | FN 534799 w | ATU75630015
          </p>
        </div>
      </footer>
    </main>
  );
}
