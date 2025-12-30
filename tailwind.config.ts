import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS Konfiguration für OpenCarBox & Carvantooo
 *
 * Dieses Designsystem implementiert die Premium "Automotive Premium" Ästhetik
 * mit dem Rot-Blau Farbkonzept gemäß project_specs.md
 *
 * @see /docs/design-system/colors.md
 * @see /docs/design-system/typography.md
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /* =================================================================
         FARBSYSTEM - Rot-Blau Premium Palette
         ================================================================= */
      colors: {
        /* Carvantooo Rot - Für Shop, E-Commerce, CTAs */
        carvantooo: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E53E3E', // Primary
          600: '#C53030', // Hover
          700: '#9B2C2C', // Active
          800: '#822727',
          900: '#63171B',
          DEFAULT: '#E53E3E',
        },
        /* Carvantooo Teal - Für Shop Akzente (finales_Design) */
        teal: {
          50: '#E6FFFA',
          100: '#B2F5EA',
          200: '#81E6D9',
          300: '#4FD1C5', // Primary Light
          400: '#38B2AC', // Hover
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
          900: '#1D4044',
          DEFAULT: '#4FD1C5',
        },
        /* Navy Blue - Header Background (finales_Design) */
        navy: {
          50: '#E8EDF4',
          100: '#C5D3E8',
          200: '#9FB5D8',
          300: '#7997C8',
          400: '#5A7FB8',
          500: '#3B67A8',
          600: '#2D5290',
          700: '#1E3A5F', // Primary Header
          800: '#162D47', // Top Bar
          900: '#0E1F2F',
          DEFAULT: '#1E3A5F',
        },
        /* OpenCarBox Blau - Für Services, Vertrauen, Navigation */
        opencarbox: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE', // Primary
          600: '#2B6CB0', // Hover
          700: '#2C5282', // Active
          800: '#2A4365',
          900: '#1A365D',
          DEFAULT: '#3182CE',
        },
        /* Neutrale Slate Palette */
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        /* Status-Farben */
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
          DEFAULT: '#10B981',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
          DEFAULT: '#F59E0B',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
          DEFAULT: '#EF4444',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
          DEFAULT: '#3B82F6',
        },
        /* shadcn/ui Kompatibilität */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      /* =================================================================
         TYPOGRAFIE - Plus Jakarta Sans + Inter
         ================================================================= */
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        /* Fluid Typography */
        'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', { lineHeight: '1.5' }],
        'xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.5rem, 1.25rem + 1.25vw, 2rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(2.25rem, 1.75rem + 2.5vw, 3rem)', { lineHeight: '1.1' }],
        '5xl': ['clamp(3rem, 2rem + 5vw, 4.5rem)', { lineHeight: '1.1' }],
        'hero': ['clamp(3.5rem, 2.5rem + 5vw, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.02em',
        wider: '0.05em',
      },

      /* =================================================================
         SPACING - 8px Grid System
         ================================================================= */
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
        '30': '7.5rem',  // 120px
        '34': '8.5rem',  // 136px
      },

      /* =================================================================
         SCHATTEN - Premium Multi-Layer
         ================================================================= */
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        /* Premium Card Shadows */
        'card': '0 2px 8px -2px rgb(0 0 0 / 0.1), 0 4px 12px -4px rgb(0 0 0 / 0.05)',
        'card-hover': '0 8px 24px -8px rgb(0 0 0 / 0.15), 0 16px 32px -16px rgb(0 0 0 / 0.1)',
        /* Glow Effects */
        'glow-red': '0 0 20px rgba(229, 62, 62, 0.4)',
        'glow-red-lg': '0 0 40px rgba(229, 62, 62, 0.5)',
        'glow-blue': '0 0 20px rgba(49, 130, 206, 0.4)',
        'glow-blue-lg': '0 0 40px rgba(49, 130, 206, 0.5)',
      },

      /* =================================================================
         BORDER RADIUS - Konsistente Rundungen
         ================================================================= */
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        'full': '9999px',
      },

      /* =================================================================
         BREAKPOINTS - Mobile-First
         ================================================================= */
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },

      /* =================================================================
         ANIMATIONEN - Smooth & Purposeful
         ================================================================= */
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        /* shadcn/ui Animationen */
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(229, 62, 62, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(229, 62, 62, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      /* =================================================================
         TRANSITIONS - Konsistente Übergänge
         ================================================================= */
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },

      /* =================================================================
         BACKDROP BLUR - Glassmorphism
         ================================================================= */
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },

      /* =================================================================
         Z-INDEX - Konsistente Ebenen
         ================================================================= */
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      /* =================================================================
         GRADIENTS - Premium Verläufe
         ================================================================= */
      backgroundImage: {
        'gradient-carvantooo': 'linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%)',
        'gradient-opencarbox': 'linear-gradient(135deg, #3182CE 0%, #1A365D 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        /* Mesh Gradients für Hero Sections */
        'mesh-red': `
          radial-gradient(at 40% 20%, rgba(229, 62, 62, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(155, 44, 44, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(254, 215, 215, 0.3) 0px, transparent 50%)
        `,
        'mesh-blue': `
          radial-gradient(at 40% 20%, rgba(49, 130, 206, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(26, 54, 93, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(190, 227, 248, 0.3) 0px, transparent 50%)
        `,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
