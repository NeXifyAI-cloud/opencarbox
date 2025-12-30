'use client'

import { companyConfig } from '@/config/company'
import { Clock, Cookie, Eye, FileText, Lock, Server, Shield, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">Datenschutzerklärung</h1>
          <p className="text-gray-600">
            Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO
          </p>
        </div>

        <div className="space-y-8">
          {/* Einleitung */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">1. Verantwortlicher</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold">{companyConfig.legalName}</p>
              <p>{companyConfig.address.street}</p>
              <p>{companyConfig.address.zip} {companyConfig.address.city}</p>
              <p className="mt-2">E-Mail: <a href={`mailto:${companyConfig.contact.email}`} className="text-[#4fd1c5] hover:underline">{companyConfig.contact.email}</a></p>
              <p>Telefon: {companyConfig.contact.phone}</p>
            </div>
          </section>

          {/* Datenerfassung */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">2. Datenerfassung auf unserer Website</h2>
            </div>

            <h3 className="font-semibold text-lg mb-3">Automatisch erfasste Daten</h3>
            <p className="text-gray-600 mb-4">
              Beim Besuch unserer Website werden automatisch folgende Daten erfasst:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Browser-Typ und -Version</li>
              <li>Betriebssystem</li>
              <li>Referrer URL (zuvor besuchte Seite)</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">Zweck der Verarbeitung</h3>
            <p className="text-gray-600">
              Diese Daten werden benötigt, um die Funktionalität unserer Website zu gewährleisten
              und unser Angebot zu verbessern. Eine Zusammenführung dieser Daten mit anderen
              Datenquellen wird nicht vorgenommen.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">3. Cookies</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem
              Endgerät gespeichert werden und die Ihr Browser speichert.
            </p>

            <h3 className="font-semibold text-lg mb-3">Arten von Cookies:</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-[#1e3a5f]">Technisch notwendige Cookies</p>
                <p className="text-gray-600 text-sm">Für die Grundfunktionen der Website erforderlich (z.B. Warenkorb, Login)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-[#1e3a5f]">Analyse-Cookies</p>
                <p className="text-gray-600 text-sm">Helfen uns zu verstehen, wie Besucher mit der Website interagieren (nur mit Ihrer Einwilligung)</p>
              </div>
            </div>
          </section>

          {/* Bestellung */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">4. Bestellung & Kundenkonto</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Bei einer Bestellung erheben wir folgende Daten:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Name und Anschrift</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (optional)</li>
              <li>Zahlungsdaten</li>
              <li>Fahrzeugdaten (für passende Ersatzteile)</li>
            </ul>
            <p className="text-gray-600">
              Diese Daten werden zur Vertragserfüllung und für gesetzliche Aufbewahrungspflichten
              (7 Jahre gemäß österreichischem Recht) gespeichert.
            </p>
          </section>

          {/* Sicherheit */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">5. Datensicherheit</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre
              Daten gegen Manipulation, Verlust oder unberechtigten Zugriff zu schützen:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Lock className="w-5 h-5 text-[#4fd1c5]" />
                <span className="text-gray-700">SSL/TLS-Verschlüsselung</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Server className="w-5 h-5 text-[#4fd1c5]" />
                <span className="text-gray-700">Sichere Serverinfrastruktur</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-[#4fd1c5]" />
                <span className="text-gray-700">Zugriffskontrollen</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-[#4fd1c5]" />
                <span className="text-gray-700">Regelmäßige Sicherheitsupdates</span>
              </div>
            </div>
          </section>

          {/* Ihre Rechte */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#4fd1c5]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">6. Ihre Rechte</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Sie haben jederzeit das Recht auf:
            </p>
            <ul className="space-y-3">
              {[
                { title: 'Auskunft', desc: 'Über Ihre bei uns gespeicherten Daten' },
                { title: 'Berichtigung', desc: 'Unrichtiger personenbezogener Daten' },
                { title: 'Löschung', desc: 'Ihrer Daten (\"Recht auf Vergessenwerden\")' },
                { title: 'Einschränkung', desc: 'Der Verarbeitung Ihrer Daten' },
                { title: 'Datenübertragbarkeit', desc: 'Ihrer Daten in einem gängigen Format' },
                { title: 'Widerspruch', desc: 'Gegen die Verarbeitung Ihrer Daten' },
              ].map((right, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-[#4fd1c5] font-bold">✓</span>
                  <div>
                    <span className="font-medium text-[#1e3a5f]">{right.title}</span>
                    <span className="text-gray-600"> – {right.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Beschwerde */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">7. Beschwerderecht</h2>
            <p className="text-gray-600 mb-4">
              Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold">Österreichische Datenschutzbehörde</p>
              <p>Barichgasse 40-42, 1030 Wien</p>
              <p>E-Mail: dsb@dsb.gv.at</p>
              <p>Website: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-[#4fd1c5] hover:underline">www.dsb.gv.at</a></p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Stand: {new Date().toLocaleDateString('de-AT')}</p>
          <p className="mt-2">
            <Link href="/impressum" className="text-[#4fd1c5] hover:underline">Impressum</Link>
            {' | '}
            <Link href="/agb" className="text-[#4fd1c5] hover:underline">AGB</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
