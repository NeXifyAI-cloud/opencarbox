/**
 * Root Layout - OpenCarBox & Carvantooo
 * 
 * Das Haupt-Layout für die gesamte Anwendung.
 * Definiert globale Fonts, Metadaten und Provider.
 * 
 * @see project_specs.md - Abschnitt 3 (Design-System)
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

/* =============================================================================
   FONT KONFIGURATION
   ============================================================================= */

/**
 * Inter - Body Font
 * Optimiert für UI und lange Texte
 */
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});

/**
 * Plus Jakarta Sans - Display Font
 * Für Headlines und hervorgehobene Texte
 */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
});

/**
 * JetBrains Mono - Monospace Font
 * Für Preise, Nummern und Code
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-mono',
});

/* =============================================================================
   METADATA
   ============================================================================= */

/**
 * Globale Metadaten für SEO
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'OpenCarBox & Carvantooo | Autoteile & KFZ-Service in Wien',
    template: '%s | OpenCarBox & Carvantooo',
  },
  description:
    'Ihr Partner für Autoteile, KFZ-Werkstatt und Autohandel in Wien. ' +
    'Premium Autoteile online bei Carvantooo kaufen oder Service bei OpenCarBox buchen. ' +
    'Weil das Auto zur Familie gehört.',
  keywords: [
    'Autoteile',
    'KFZ-Werkstatt',
    'Wien',
    'Autohandel',
    'Bremsbeläge',
    'Ölwechsel',
    'Inspektion',
    'Carvantooo',
    'OpenCarBox',
  ],
  authors: [{ name: 'OpenCarBox GmbH' }],
  creator: 'OpenCarBox GmbH',
  publisher: 'OpenCarBox GmbH',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: '/',
    siteName: 'OpenCarBox & Carvantooo',
    title: 'OpenCarBox & Carvantooo | Autoteile & KFZ-Service',
    description:
      'Premium Autoteile online kaufen und professionellen KFZ-Service buchen. ' +
      'Weil das Auto zur Familie gehört.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OpenCarBox & Carvantooo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCarBox & Carvantooo',
    description: 'Premium Autoteile & KFZ-Service in Wien',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

/**
 * Viewport-Konfiguration
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/* =============================================================================
   ROOT LAYOUT KOMPONENTE
   ============================================================================= */

/**
 * Root Layout Props
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout Komponente
 * 
 * Umschließt die gesamte Anwendung und definiert:
 * - HTML-Struktur mit Sprachattribut
 * - Font-Variablen
 * - Global Provider (TODO: Implementieren)
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background antialiased">
        {/* 
          TODO: Provider hinzufügen:
          - ThemeProvider (Dark Mode)
          - QueryClientProvider (TanStack Query)
          - Toaster (Benachrichtigungen)
        */}
        {children}
      </body>
    </html>
  );
}

