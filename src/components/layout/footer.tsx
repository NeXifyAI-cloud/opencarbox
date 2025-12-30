'use client'

import { companyConfig } from '@/config/company'
import {
    Clock,
    CreditCard,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Shield,
    Truck,
    Twitter
} from 'lucide-react'
import Link from 'next/link'

/**
 * Footer Component - Carvantooo Design System
 * Basierend auf finales_Design Branch
 * Navy Background + Teal Accents
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Trust-Badges Sektion */}
      <div className="border-b border-[#4fd1c5]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#4fd1c5]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Schneller Versand</p>
                <p className="text-xs text-gray-400">1-3 Werktage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#4fd1c5]" />
              </div>
              <div>
                <p className="font-semibold text-sm">30 Tage Rückgabe</p>
                <p className="text-xs text-gray-400">Kostenlos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#4fd1c5]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Sichere Zahlung</p>
                <p className="text-xs text-gray-400">SSL-verschlüsselt</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#4fd1c5]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Kundenservice</p>
                <p className="text-xs text-gray-400">Mo-Fr 8-18 Uhr</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Haupt-Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Spalte 1: Unternehmen */}
          <div>
            <h3 className="text-[#4fd1c5] font-bold text-lg mb-4">
              {companyConfig.name}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {companyConfig.claim}
            </p>
            <p className="text-gray-400 text-sm">
              Ihr Premium-Partner für Autoteile, Werkstattservice und Gebrauchtwagen.
              Qualität und Vertrauen seit der Gründung.
            </p>
          </div>

          {/* Spalte 2: Kategorien */}
          <div>
            <h3 className="text-[#4fd1c5] font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kategorien" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Alle Kategorien
                </Link>
              </li>
              <li>
                <Link href="/marken" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Marken
                </Link>
              </li>
              <li>
                <Link href="/werkstatt" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Werkstatt
                </Link>
              </li>
              <li>
                <Link href="/fahrzeuge" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Fahrzeughandel
                </Link>
              </li>
              <li>
                <Link href="/angebote" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Angebote
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 3: Service & Rechtliches */}
          <div>
            <h3 className="text-[#4fd1c5] font-bold text-lg mb-4">Service & Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hilfe" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Hilfe & FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/versand" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Versand & Lieferung
                </Link>
              </li>
              <li>
                <Link href="/zahlung" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Zahlungsarten
                </Link>
              </li>
              <li>
                <Link href="/rueckgabe" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Rückgabe & Widerruf
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 4: Kontakt */}
          <div>
            <h3 className="text-[#4fd1c5] font-bold text-lg mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4fd1c5] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {companyConfig.address.street}<br />
                  {companyConfig.address.zip} {companyConfig.address.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4fd1c5] flex-shrink-0" />
                <a
                  href={`tel:${companyConfig.contact.phone}`}
                  className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm"
                >
                  {companyConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4fd1c5] flex-shrink-0" />
                <a
                  href={`mailto:${companyConfig.contact.email}`}
                  className="text-gray-300 hover:text-[#4fd1c5] transition-colors text-sm"
                >
                  {companyConfig.contact.email}
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-[#4fd1c5] font-semibold text-sm mb-3">Folgen Sie uns</p>
              <div className="flex gap-3">
                <a
                  href={companyConfig.social?.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center hover:bg-[#4fd1c5]/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-[#4fd1c5]" />
                </a>
                <a
                  href={companyConfig.social?.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center hover:bg-[#4fd1c5]/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-[#4fd1c5]" />
                </a>
                <a
                  href={companyConfig.social?.twitter || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center hover:bg-[#4fd1c5]/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-[#4fd1c5]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#4fd1c5]/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {companyConfig.legalName}. Alle Rechte vorbehalten.
            </p>
            <p className="text-gray-500 text-xs">
              {companyConfig.legal.uid} | {companyConfig.legal.registerNumber}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
