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

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Impressum</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Angaben gemäß § 5 ECG</h2>
            <p className="text-gray-600">
              <strong>Carvatoo GmbH</strong><br />
              Autostraße 123<br />
              1010 Wien<br />
              Österreich
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Kontakt</h2>
            <p className="text-gray-600">
              Telefon: +43 1 987 65 43<br />
              E-Mail: info@carvatoo.at<br />
              Website: www.carvatoo.at
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Unternehmensgegenstand</h2>
            <p className="text-gray-600">
              Online-Handel mit Kfz-Teilen und Autozubehör
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Firmenbuchnummer</h2>
            <p className="text-gray-600">
              FN 123456a<br />
              Firmenbuchgericht: Handelsgericht Wien
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">UID-Nummer</h2>
            <p className="text-gray-600">
              ATU12345678
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Geschäftsführer</h2>
            <p className="text-gray-600">
              Max Mustermann
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Aufsichtsbehörde</h2>
            <p className="text-gray-600">
              Magistratisches Bezirksamt des I. Bezirkes
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">Streitschlichtung</h2>
            <p className="text-gray-600">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" className="text-[#4fd1c5] hover:underline" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImpressumPage;
