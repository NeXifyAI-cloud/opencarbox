import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ImpressumPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Impressum</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Carvatoo.de by OpenCarBox</h1>
        <p className="text-gray-600 mb-8">Informationspflicht gemäß § 5 ECG und § 14 UGB</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Unternehmensdaten</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold block text-gray-800">Firmenname:</span>
                  OpenCarBox GmbH
                </p>
                <p>
                  <span className="font-semibold block text-gray-800">Geschäftsführer:</span>
                  Herr Arac Metehan
                </p>
                <p>
                  <span className="font-semibold block text-gray-800">Gründungsjahr:</span>
                  16.06.2020
                </p>
                <p>
                  <span className="font-semibold block text-gray-800">Tätigkeitsbeschreibung:</span>
                  Betrieb einer KFZ-Reparaturwerkstätte; Autohandel
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Kontaktdaten</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold block text-gray-800">Adresse:</span>
                  Rennweg 76<br />
                  1030 Wien, Österreich
                </p>
                <p>
                  <span className="font-semibold block text-gray-800">Telefon:</span>
                  <a href="tel:+4317981310" className="hover:text-[#4fd1c5]">01 7981310</a>
                </p>
                <p>
                  <span className="font-semibold block text-gray-800">E-Mail:</span>
                  <a href="mailto:office@opencarbox.co.at" className="hover:text-[#4fd1c5]">office@opencarbox.co.at</a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Rechtliche Angaben</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <p>
                <span className="font-semibold text-gray-800">Firmenbuch-Nr.:</span> FN 534799 w
              </p>
              <p>
                <span className="font-semibold text-gray-800">UID-Nummer:</span> ATU75630015
              </p>
              <p>
                <span className="font-semibold text-gray-800">Firmenbuchgericht:</span> Handelsgericht Wien
              </p>
              <p>
                <span className="font-semibold text-gray-800">Rechtsform:</span> Gesellschaft mit beschränkter Haftung (GmbH)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Aufsichtsbehörde & Gewerberecht</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <span className="font-semibold block text-gray-800">Zuständige Gewerbebehörde:</span>
                Magistrat der Stadt Wien, Magistratsabteilung 63<br/>
                Friedrich-Schmidt-Platz 3-4, 1080 Wien
              </p>
              <div>
                <span className="font-semibold block text-gray-800 mb-1">Berufsrechtliche Regelungen:</span>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Gewerbeordnung 1994 (GewO 1994)</li>
                  <li>Kraftfahrgesetz 1967 (KFG 1967)</li>
                  <li>Kraftfahrgesetz-Durchführungsverordnung 1967 (KDV 1967)</li>
                  <li>EU-Fahrzeuggenehmigungsverordnung</li>
                  <li>Produkthaftungsgesetz (PHG)</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold block text-gray-800 mb-1">Gewerbeberechtigungen:</span>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Kraftfahrzeugtechnik (§ 94 Z 73 GewO 1994)</li>
                  <li>Handel mit Kraftfahrzeugen (§ 94 Z 22 GewO 1994)</li>
                  <li>Überprüfung von Fahrzeugen gemäß § 57a KFG</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Online-Streitbeilegung</h2>
            <p className="text-gray-600 mb-2">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" className="text-[#4fd1c5] hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="text-gray-600">
              Unsere E-Mail-Adresse für Streitbeilegungsverfahren: office@opencarbox.co.at
            </p>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
            <h3 className="font-bold mb-2">Haftungsausschluss</h3>
            <p className="mb-2">
              Als Diensteanbieter sind wir gemäß § 16 ECG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
              Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
            </p>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImpressumPage;
