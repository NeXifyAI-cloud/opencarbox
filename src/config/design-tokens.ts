/**
 * OpenCarBox Design Tokens (DOS v1.1 G9 compliant)
 * 
 * Shop (Carvantooo): #FFB300
 * Werkstatt/Autohandel (OpenCarBox): #FFA800
 */

export const designTokens = {
  // Brand Colors - Shop (Carvantooo)
  shop: {
    DEFAULT: '#FFB300',
    foreground: '#000000',
  },

  // Brand Colors - Werkstatt & Autohandel (OpenCarBox)
  brand: {
    DEFAULT: '#FFA800',
    foreground: '#000000',
  },
  
  // Semantic Colors (Standardized)
  success: {
    DEFAULT: '#22C55E',
    foreground: '#FFFFFF',
  },
  
  warning: {
    DEFAULT: '#F59E0B',
    foreground: '#000000',
  },
  
  error: {
    DEFAULT: '#EF4444',
    foreground: '#FFFFFF',
  },
  
  info: {
    DEFAULT: '#3B82F6',
    foreground: '#FFFFFF',
  },
  
  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },
  
  // Background & Surface
  background: {
    DEFAULT: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F4F4F5',
  },
  
  surface: {
    DEFAULT: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#18181B',
    secondary: '#71717A',
    tertiary: '#A1A1AA',
    disabled: '#D4D4D8',
    inverse: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    DEFAULT: '#E4E4E7',
    strong: '#D4D4D8',
    subtle: '#F4F4F5',
  },
  
  // Spacing System (8px Grid raster)
  spacing: {
    px: '1px',
    0: '0',
    1: '4px',     // xs (Raster half)
    2: '8px',     // sm (Base)
    3: '12px',
    4: '16px',    // md
    6: '24px',    // lg
    8: '32px',    // xl
    10: '40px',
    12: '48px',   // 2xl
    16: '64px',   // 3xl
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '8px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  
  // Z-Index
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',      // Header
    40: '40',      // Sidebar
    50: '50',      // Toast/Notification
    60: '60',      // Dropdown
    70: '70',      // Modal Backdrop
    80: '80',      // Modal
    100: '100',    // Tooltip
  },
} as const

// Typ für TypeScript
export type DesignTokens = typeof designTokens