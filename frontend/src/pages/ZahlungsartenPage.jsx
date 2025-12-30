import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Wallet, Banknote } from 'lucide-react';

const ZahlungsartenPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Zahlungsarten</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Zahlungsarten</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <p className="text-gray-600 mb-6">
            Bei Carvantooo können Sie sicher und bequem bezahlen. Wir bieten Ihnen folgende Zahlungsmöglichkeiten an:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Kreditkarte */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-[#4fd1c5] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-full text-[#1e3a5f]">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Kreditkarte</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Wir akzeptieren VISA, MasterCard und American Express. Die Belastung erfolgt mit Abschluss der Bestellung.
                Sicher verschlüsselte Übertragung per SSL.
              </p>
            </div>

            {/* PayPal */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-[#4fd1c5] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-full text-[#003087]">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">PayPal</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Bezahlen Sie einfach und schnell mit Ihrem PayPal-Konto. Sie werden am Ende des Bestellvorgangs direkt zu PayPal weitergeleitet.
              </p>
            </div>

            {/* Klarna */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-[#4fd1c5] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-50 p-2 rounded-full text-[#FFB3C7]">
                  <span className="font-bold text-lg">K.</span>
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Klarna Rechnung</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Erst kaufen, später bezahlen. Mit Klarna Rechnung haben Sie 14 Tage Zeit, Ihre Rechnung zu begleichen.
              </p>
            </div>

            {/* Vorkasse */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-[#4fd1c5] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gray-50 p-2 rounded-full text-gray-600">
                  <Banknote className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Vorkasse / Überweisung</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sie überweisen den Betrag vorab auf unser Bankkonto. Die Ware wird nach Zahlungseingang versendet.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-[#1e3a5f] mb-2">Sicherheitshinweis</h3>
            <p className="text-sm text-gray-600">
              Ihre Daten werden bei uns durch modernste Sicherheitstechnologien geschützt. 
              Wir nutzen SSL-Verschlüsselung für alle Transaktionen.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ZahlungsartenPage;
