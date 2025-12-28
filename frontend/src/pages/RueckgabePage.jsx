import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, RotateCcw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const RueckgabePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Rückgabe & Reklamation</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Rückgabe & Reklamation</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start gap-4">
            <RotateCcw className="h-8 w-8 text-[#1e3a5f] flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-2">30 Tage Rückgaberecht</h2>
              <p className="text-gray-600">
                Sie können Artikel innerhalb von 30 Tagen nach Erhalt ohne Angabe von Gründen an uns zurücksenden.
                Die Rücksendung ist für Sie kostenlos (innerhalb Österreichs).
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" /> So funktioniert die Rücksendung
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Rücksendeantrag starten</h3>
                  <p className="text-gray-600 text-sm">Gehen Sie in Ihr Kundenkonto unter "Bestellungen" und wählen Sie "Artikel zurücksenden".</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Label ausdrucken</h3>
                  <p className="text-gray-600 text-sm">Drucken Sie das kostenlose Retourenlabel aus und kleben Sie es auf das Paket.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Paket abgeben</h3>
                  <p className="text-gray-600 text-sm">Geben Sie das Paket bei einer Post-Filiale oder einem Paketshop ab.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Geld zurückerhalten</h3>
                  <p className="text-gray-600 text-sm">Nach Prüfung der Ware erstatten wir den Betrag innerhalb von 5-7 Werktagen auf Ihr ursprüngliches Zahlungsmittel.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/konto">
                <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold">
                  Jetzt Rücksendung starten
                </Button>
              </Link>
            </div>
          </section>

          <div className="border-t border-gray-100 pt-8"></div>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Wichtige Hinweise
            </h2>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>Die Ware muss unbenutzt, unbeschädigt und in der Originalverpackung sein.</li>
              <li>Einbauteile dürfen keine Montagespuren aufweisen.</li>
              <li>Öle und Flüssigkeiten dürfen nicht geöffnet sein.</li>
              <li>Bitte legen Sie den Rücksendeschein dem Paket bei.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Reklamation / Defekte Ware
            </h2>
            <p className="text-gray-600 mb-4">
              Sollte ein Artikel defekt oder falsch geliefert worden sein, kontaktieren Sie bitte direkt unseren Kundenservice.
              Wir kümmern uns umgehend um einen Austausch oder Ersatz.
            </p>
            <Link to="/kontakt" className="text-[#4fd1c5] font-semibold hover:underline">
              Zum Kontaktformular
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RueckgabePage;
