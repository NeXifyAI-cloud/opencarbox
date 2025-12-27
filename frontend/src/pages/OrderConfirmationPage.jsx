import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Vielen Dank für Ihre Bestellung!</h1>
          <p className="text-gray-600 mb-6">
            Ihre Bestellung <span className="font-mono font-medium text-[#1e3a5f]">#{orderId}</span> wurde erfolgreich entgegengenommen.
            Sie erhalten in Kürze eine Bestätigung per E-Mail.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-8">
            <h3 className="text-sm font-bold text-[#1e3a5f] mb-2">Nächste Schritte:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-xs">1</span>
                Auftragsbestätigung per E-Mail
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">2</span>
                Versandvorbereitung
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">3</span>
                Zustellung durch DHL
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/">
              <Button className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f]">
                Zurück zum Shop
              </Button>
            </Link>
            <Link to="/konto">
              <Button variant="outline" className="w-full">
                Bestellung ansehen
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
