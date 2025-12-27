/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
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
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
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
        /* kfzteile24 Orange - Für Aktionen, CTAs, Hochzeiten */
        kfz: {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FECACA',
          300: '#FDA4A4',
          400: '#FB7185',
          500: '#FF6B35', // Primary Orange wie kfzteile24
          600: '#EA580C', // Hover
          700: '#C2410C', // Active
          800: '#9A3412',
          900: '#7C2D12',
          DEFAULT: '#FF6B35',
        },
        /* kfzteile24 Grau-Palette für Filter und Backgrounds */
        kfzgray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          DEFAULT: '#6B7280',
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
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'gradient-carvantooo': 'linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%)',
        'gradient-opencarbox': 'linear-gradient(135deg, #3182CE 0%, #1A365D 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
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
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(229, 62, 62, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(229, 62, 62, 0.5)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      boxShadow: {
        'card-premium': '0 2px 8px -2px rgb(0 0 0 / 0.1), 0 4px 12px -4px rgb(0 0 0 / 0.05)',
        'glow-red': '0 0 20px rgba(229, 62, 62, 0.4)',
        'glow-blue': '0 0 20px rgba(49, 130, 206, 0.4)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
