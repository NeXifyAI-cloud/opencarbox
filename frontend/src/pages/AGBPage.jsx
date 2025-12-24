import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const AGBPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">AGB</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Allgemeine Geschäftsbedingungen</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 1 Geltungsbereich</h2>
            <p className="text-gray-600">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die über 
              unseren Online-Shop getätigt werden. Vertragssprache ist Deutsch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 2 Vertragsschluss</h2>
            <p className="text-gray-600">
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, 
              sondern eine Aufforderung zur Abgabe einer Bestellung dar. Mit dem Absenden der Bestellung 
              geben Sie ein verbindliches Angebot ab. Der Kaufvertrag kommt zustande, wenn wir Ihre 
              Bestellung durch eine Auftragsbestätigung per E-Mail bestätigen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 3 Preise und Zahlungsbedingungen</h2>
            <p className="text-gray-600">
              Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen Mehrwertsteuer. 
              Zusätzlich anfallende Versandkosten werden im jeweiligen Angebot gesondert ausgewiesen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 4 Lieferung</h2>
            <p className="text-gray-600">
              Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse. Die Lieferzeit beträgt 
              in der Regel 1-3 Werktage nach Zahlungseingang. Bei Lieferverzögerungen werden wir Sie 
              unverzüglich informieren.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 5 Widerrufsrecht</h2>
            <p className="text-gray-600">
              Als Verbraucher haben Sie das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen 
              Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder 
              ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 6 Gewährleistung</h2>
            <p className="text-gray-600">
              Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist beträgt 
              zwei Jahre ab Erhalt der Ware.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">§ 7 Schlussbestimmungen</h2>
            <p className="text-gray-600">
              Es gilt das Recht der Republik Österreich unter Ausschluss des UN-Kaufrechts. 
              Gerichtsstand für alle Streitigkeiten ist Wien.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t">
            Stand: Januar 2025
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AGBPage;
