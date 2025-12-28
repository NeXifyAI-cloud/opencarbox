import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { companyConfig } from '../config/company';

const DatenschutzPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Datenschutz</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Datenschutzerklärung</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 prose max-w-none">
          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-semibold mt-4">Allgemeine Hinweise</h3>
            <p className="text-gray-600">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
              Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit 
              denen Sie persönlich identifiziert werden können.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">2. Verantwortliche Stelle</h2>
            <p className="text-gray-600">
              <strong>{companyConfig.legalName}</strong><br />
              {companyConfig.address.street}<br />
              {companyConfig.address.zip} {companyConfig.address.city}, {companyConfig.address.country}<br />
              E-Mail: {companyConfig.contact.email}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">3. Datenerfassung auf dieser Website</h2>
            <h3 className="font-semibold mt-4">Cookies</h3>
            <p className="text-gray-600">
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf 
              Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, 
              effektiver und sicherer zu machen.
            </p>
            <h3 className="font-semibold mt-4">Server-Log-Dateien</h3>
            <p className="text-gray-600">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">4. Ihre Rechte</h2>
            <p className="text-gray-600">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten 
              personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung 
              sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-3">5. SSL-Verschlüsselung</h2>
            <p className="text-gray-600">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
              Inhalte eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, 
              dass die Adresszeile des Browsers von "http://" auf "https://" wechselt.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DatenschutzPage;
