import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    Youtube,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Footer-Link Gruppen
 */
const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'Alle Produkte', href: '/shop/produkte' },
      { label: 'Kategorien', href: '/shop/kategorien' },
      { label: 'Angebote', href: '/shop/angebote' },
      { label: 'Neuheiten', href: '/shop/neuheiten' },
      { label: 'Bestseller', href: '/shop/bestseller' },
    ],
  },
  werkstatt: {
    title: 'Werkstatt',
    links: [
      { label: 'Alle Services', href: '/werkstatt/services' },
      { label: 'Termin buchen', href: '/werkstatt/termin' },
      { label: 'Preisliste', href: '/werkstatt/preise' },
      { label: 'Reparatur-Status', href: '/werkstatt/status' },
    ],
  },
  autohandel: {
    title: 'Autohandel',
    links: [
      { label: 'Fahrzeuge', href: '/autohandel/fahrzeuge' },
      { label: 'Ankauf', href: '/autohandel/ankauf' },
      { label: 'Finanzierung', href: '/autohandel/finanzierung' },
      { label: 'Probefahrt', href: '/autohandel/probefahrt' },
    ],
  },
  service: {
    title: 'Service & Hilfe',
    links: [
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'FAQ', href: '/hilfe/faq' },
      { label: 'Versand', href: '/hilfe/versand' },
      { label: 'Retoure', href: '/hilfe/retoure' },
      { label: 'Garantie', href: '/hilfe/garantie' },
    ],
  },
  rechtliches: {
    title: 'Rechtliches',
    links: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'AGB', href: '/agb' },
      { label: 'Widerrufsrecht', href: '/widerruf' },
    ],
  },
};

/**
 * Trust-Badges
 */
const trustBadges = [
  { icon: Truck, label: 'Kostenloser Versand ab 50€' },
  { icon: Shield, label: '2 Jahre Garantie' },
  { icon: Clock, label: 'Schnelle Lieferung' },
  { icon: CreditCard, label: 'Sichere Zahlung' },
];

/**
 * Social Media Links
 */
const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/carvantooo', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/carvantooo', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/carvantooo', label: 'YouTube' },
];

/**
 * Footer-Komponente für alle Seiten.
 *
 * @example
 * <Footer />
 */
export function Footer() {
  return (
    <footer className="border-t bg-neutral-50">
      {/* Trust Badges */}
      <div className="border-b bg-white py-6">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 text-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-opencarbox-100 text-opencarbox-600">
                  <badge.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-opencarbox-500 font-bold text-white">
                  O
                </div>
                <div>
                  <span className="text-lg font-bold text-opencarbox-600">OpenCarBox</span>
                  <span className="block text-xs text-muted-foreground">by Carvantooo</span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Weil das Auto zur Familie gehört. Ihr Partner für Ersatzteile,
              Werkstatt-Services und Fahrzeuge in Österreich.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">Newsletter abonnieren</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="E-Mail-Adresse"
                  className="flex-1"
                />
                <Button variant="opencarbox">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                10% Rabatt auf Ihre erste Bestellung
              </p>
            </div>

            {/* Kontakt */}
            <div className="space-y-2 text-sm">
              <a
                href="tel:+4312345678"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                +43 1 234 567 8
              </a>
              <a
                href="mailto:info@carvantooo.at"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                info@carvantooo.at
              </a>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Musterstraße 123, 1010 Wien
              </p>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {footerLinks.shop.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-carvantooo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {footerLinks.werkstatt.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.werkstatt.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-opencarbox-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {footerLinks.service.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.service.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {footerLinks.rechtliches.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.rechtliches.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-neutral-100 py-4">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} OpenCarBox GmbH (Carvantooo). Alle Rechte vorbehalten.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Zahlungsarten:</span>
              <div className="flex items-center gap-1.5">
                {/* Placeholder für Payment Icons */}
                <div className="h-6 w-10 rounded bg-neutral-200" title="Visa" />
                <div className="h-6 w-10 rounded bg-neutral-200" title="Mastercard" />
                <div className="h-6 w-10 rounded bg-neutral-200" title="PayPal" />
                <div className="h-6 w-10 rounded bg-neutral-200" title="Klarna" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
