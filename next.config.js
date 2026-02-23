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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  /* Umgebungsvariablen (öffentlich) */
  env: {
    NEXT_PUBLIC_APP_NAME: 'OpenCarBox & Carvantooo',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  /* Weiterleitungen — defined in vercel.json (single source of truth) */

  /* Header für Performance (security headers in vercel.json — single source of truth) */
  async headers() {
    return [
      /* Cache-Header für statische Assets */
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

  /* Webpack-Konfiguration */
  webpack: (config, { isServer }) => {
    /* SVG als React-Komponenten */
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  /* TypeScript-Fehler beim Build ignorieren (NICHT für Production empfohlen) */
  typescript: {
    // Setze auf true nur für Notfälle - normalerweise false
    ignoreBuildErrors: false,
  },

  /* ESLint-Fehler beim Build ignorieren (NICHT für Production empfohlen) */
  eslint: {
    // Setze auf true nur für Notfälle - normalerweise false
    ignoreDuringBuilds: false,
  },

  /* Output-Konfiguration für Vercel */
  output: 'standalone',

  /* Powered-by Header entfernen */
  poweredByHeader: false,
};

module.exports = nextConfig;
