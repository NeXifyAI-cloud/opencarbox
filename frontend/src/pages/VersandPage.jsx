import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Clock, MapPin, Globe } from 'lucide-react';

const VersandPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Versand & Lieferung</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Versand & Lieferung</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#e6fffa] p-2 rounded-full">
                <Truck className="h-6 w-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1e3a5f]">Versandkosten</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 font-semibold text-gray-700">Land</th>
                    <th className="py-3 font-semibold text-gray-700">Bestellwert</th>
                    <th className="py-3 font-semibold text-gray-700">Kosten</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50">
                    <td className="py-3">Österreich</td>
                    <td className="py-3">unter 120,00 €</td>
                    <td className="py-3">5,99 €</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3">Österreich</td>
                    <td className="py-3 font-bold text-[#1e3a5f]">ab 120,00 €</td>
                    <td className="py-3 font-bold text-green-600">Kostenlos</td>
                  </tr>
                  <tr>
                    <td className="py-3">Deutschland</td>
                    <td className="py-3">pauschal</td>
                    <td className="py-3">9,99 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#e6fffa] p-2 rounded-full">
                <Clock className="h-6 w-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1e3a5f]">Lieferzeiten</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Wir versenden Ihre Bestellung in der Regel innerhalb von 24 Stunden nach Zahlungseingang.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[100px]">Österreich:</span>
                <span>1-3 Werktage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[100px]">Deutschland:</span>
                <span>2-4 Werktage</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#e6fffa] p-2 rounded-full">
                <Globe className="h-6 w-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1e3a5f]">Logistikpartner</h2>
            </div>
            <p className="text-gray-600">
              Unsere Pakete werden sicher und zuverlässig mit unseren Logistikpartnern <strong>DHL</strong> und <strong>Österreichische Post</strong> versendet. 
              Sie erhalten zu jeder Bestellung eine Sendungsnummer zur Nachverfolgung.
            </p>
          </section>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
            <h3 className="font-semibold text-[#1e3a5f] mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Selbstabholung
            </h3>
            <p className="text-sm text-gray-600">
              Gerne können Sie Ihre Bestellung auch kostenfrei in unserer Filiale in Wien abholen:<br />
              <strong>Carvatoo Abholshop, Rennweg 76, 1030 Wien</strong><br />
              Mo-Fr: 08:00 - 18:00 Uhr
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VersandPage;
