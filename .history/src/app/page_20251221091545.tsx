/**
 * Homepage - OpenCarBox & Carvantooo
 * 
 * Landing Page mit Hero, Bereichsübersicht und CTAs.
 * 
 * @see project_specs.md - Design-System
 */

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-mesh-red texture-noise">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <div className="relative z-10 container-content text-center">
          {/* Logo/Branding */}
          <div className="mb-8 animate-fade-in-down">
            <span className="inline-block px-4 py-2 rounded-full bg-carvantooo-100 text-carvantooo-700 text-sm font-medium">
              Willkommen bei
            </span>
          </div>
          
          {/* Headline */}
          <h1 className="text-hero font-display font-bold text-slate-900 mb-6 animate-fade-in">
            <span className="text-gradient-red">OpenCarBox</span>
            <span className="text-slate-400 mx-4">&</span>
            <span className="text-gradient-blue">Carvantooo</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            Ihr Partner für{' '}
            <strong className="text-opencarbox-600">KFZ-Service</strong>,{' '}
            <strong className="text-opencarbox-600">Autohandel</strong> und{' '}
            <strong className="text-carvantooo-600">Premium Autoteile</strong>.
            <br />
            <em className="text-slate-500">Weil das Auto zur Familie gehört.</em>
          </p>
          
          {/* Fahrzeug-Finder Card */}
          <div className="card-glass max-w-2xl mx-auto p-8 mb-12 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              🚗 Finde passende Teile für dein Auto
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="HSN/TSN oder Kennzeichen eingeben..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-carvantooo-500 focus:ring-2 focus:ring-carvantooo-500/20 outline-none transition-all"
              />
              <button className="btn-gradient-red px-8 py-3 rounded-lg font-semibold whitespace-nowrap">
                Teile finden →
              </button>
            </div>
            
            <p className="text-sm text-slate-500 mt-4">
              HSN und TSN findest du in deinem Fahrzeugschein (Zulassungsbescheinigung Teil I).
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 animate-stagger">
            <a
              href="/shop"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-carvantooo-500 text-white font-medium hover:bg-carvantooo-600 transition-all hover:scale-105"
            >
              <span>🛒</span>
              <span>Zum Shop</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <a
              href="/werkstatt"
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

