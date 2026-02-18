/** @type {import('next').NextConfig} */

/**
 * Next.js Konfiguration für OpenCarBox & Carvantooo
 * 
 * @see project_specs.md für Details zur Architektur
 */
const nextConfig = {
  /* React Strict Mode für bessere Entwicklung */
  reactStrictMode: true,

  /* Experimentelle Features */
  experimental: {
    /* Optimierte Package Imports */
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
      'date-fns',
    ],
  },

  /* Bilder-Konfiguration */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  /* Umgebungsvariablen (öffentlich) */
  env: {
    NEXT_PUBLIC_APP_NAME: 'OpenCarBox & Carvantooo',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  /* Weiterleitungen */
  async redirects() {
    return [
      {
        source: '/produkte',
        destination: '/shop/produkte',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/werkstatt/services',
        permanent: true,
      },
    ];
  },

  /* Header für Sicherheit und Performance */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  /* TypeScript-Fehler beim Build ignorieren (NICHT für Production empfohlen) */
  typescript: {
    ignoreBuildErrors: false,
  },

  /* ESLint-Fehler beim Build ignorieren (NICHT für Production empfohlen) */
  eslint: {
    ignoreDuringBuilds: false,
  },

  /* Output-Konfiguration für Vercel */
  output: 'standalone',

  /* Powered-by Header entfernen */
  poweredByHeader: false,
};

module.exports = nextConfig;
