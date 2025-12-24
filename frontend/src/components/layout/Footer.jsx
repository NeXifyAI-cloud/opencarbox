import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Youtube, CreditCard, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 rounded-lg p-2">
                <Car className="h-6 w-6 text-[#4fd1c5]" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Carvatoo</span>
                <p className="text-xs text-[#4fd1c5] -mt-1">Weil dein Auto zur Familie gehört.</p>
              </div>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              Carvatoo ist Ihr zuverlässiger Partner für hochwertige Kfz-Teile und Autozubehör. 
              Mit über 3 Millionen Teilen im Sortiment finden Sie bei uns alles, was Ihr Auto braucht.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-[#4fd1c5] hover:text-[#1e3a5f] transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-[#4fd1c5] hover:text-[#1e3a5f] transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-lg hover:bg-[#4fd1c5] hover:text-[#1e3a5f] transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#4fd1c5]">Schnelllinks</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kategorien" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Alle Kategorien</Link></li>
              <li><Link to="/angebote" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Aktuelle Angebote</Link></li>
              <li><Link to="/marken" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Marken</Link></li>
              <li><Link to="/neuheiten" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Neuheiten</Link></li>
              <li><Link to="/bestseller" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Bestseller</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#4fd1c5]">Kundenservice</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hilfe" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Hilfe & FAQ</Link></li>
              <li><Link to="/versand" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Versand & Lieferung</Link></li>
              <li><Link to="/rueckgabe" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Rückgabe</Link></li>
              <li><Link to="/zahlung" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Zahlungsarten</Link></li>
              <li><Link to="/kontakt" className="text-gray-300 hover:text-[#4fd1c5] transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#4fd1c5]">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-[#4fd1c5]" />
                <span>+43 1 987 65 43</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-[#4fd1c5]" />
                <span>info@carvatoo.at</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-[#4fd1c5] mt-0.5" />
                <span>Carvatoo GmbH<br />Autostraße 123<br />1010 Wien, Österreich</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Zahlungsarten:</span>
              <div className="flex gap-2">
                <div className="bg-white/10 rounded px-2 py-1 text-xs">Visa</div>
                <div className="bg-white/10 rounded px-2 py-1 text-xs">Mastercard</div>
                <div className="bg-white/10 rounded px-2 py-1 text-xs">PayPal</div>
                <div className="bg-white/10 rounded px-2 py-1 text-xs">Klarna</div>
                <div className="bg-white/10 rounded px-2 py-1 text-xs">SEPA</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#4fd1c5]" />
              <span className="text-sm text-gray-300">Kostenloser Versand ab 120€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#162d47]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2025 Carvatoo GmbH. Alle Rechte vorbehalten.</p>
            <div className="flex gap-4">
              <Link to="/impressum" className="hover:text-[#4fd1c5] transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="hover:text-[#4fd1c5] transition-colors">Datenschutz</Link>
              <Link to="/agb" className="hover:text-[#4fd1c5] transition-colors">AGB</Link>
              <Link to="/widerruf" className="hover:text-[#4fd1c5] transition-colors">Widerrufsrecht</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
