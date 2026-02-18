/**
 * OpenCarBox Design Tokens
 * Basierend auf Sharon UI Base Tokens v2.0
 * 
 * Primary: Professionelles Blau (#3B82F6) für OpenCarBox Werkstatt & Autohandel
 * Secondary: Teal (#14B8A6) für Carvantooo Shop
 * 
 * @see sharon_ui_base_tokens.md
 */

export const designTokens = {
  // Primary - OpenCarBox (Werkstatt & Autohandel)
  primary: {
    DEFAULT: '#3B82F6',      // Professionelles Blau
    light: '#60A5FA',
    dark: '#2563EB',
    foreground: '#FFFFFF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  
  // Secondary - Carvantooo Shop
  secondary: {
    DEFAULT: '#14B8A6',      // Teal
    light: '#5EEAD4',
    dark: '#0D9488',
    foreground: '#FFFFFF',
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },
  
  // Accent - Highlight-Farbe
  accent: {
    DEFAULT: '#F59E0B',      // Amber
    light: '#FCD34D',
    dark: '#D97706',
    foreground: '#000000',
  },
  
  // Semantic Colors
  success: {
    DEFAULT: '#22C55E',
    light: '#86EFAC',
    dark: '#16A34A',
    foreground: '#FFFFFF',
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
    foreground: '#000000',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },
  
  error: {
    DEFAULT: '#EF4444',
    light: '#FCA5A5',
    dark: '#DC2626',
    foreground: '#FFFFFF',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  
  info: {
    DEFAULT: '#3B82F6',
    light: '#93C5FD',
    dark: '#2563EB',
    foreground: '#FFFFFF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
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
  
  // Spacing System (4px Raster)
  spacing: {
    px: '1px',
    0: '0',
    0.5: '2px',
    1: '4px',     // xs
    2: '8px',     // sm
    3: '12px',
    4: '16px',    // md (base)
    5: '20px',
    6: '24px',    // lg
    8: '32px',    // xl
    10: '40px',
    12: '48px',   // 2xl
    16: '64px',   // 3xl
    20: '80px',
    24: '96px',
    32: '128px',
  },
  
  // Semantic Spacing
  semanticSpacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    DEFAULT: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  
  // Z-Index
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',      // Header
    40: '40',      // Sidebar
    45: '45',      // Mobile Header
    50: '50',      // Toast/Notification
    60: '60',      // Dropdown
    70: '70',      // Modal Backdrop
    80: '80',      // Modal
    90: '90',      // Popover
    100: '100',    // Tooltip
  },
  
  // Animation
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Dark Mode Varianten
export const darkDesignTokens = {
  background: {
    DEFAULT: '#09090B',
    secondary: '#18181B',
    tertiary: '#27272A',
  },
  
  surface: {
    DEFAULT: '#18181B',
    elevated: '#27272A',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  text: {
    primary: '#FAFAFA',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
    disabled: '#52525B',
    inverse: '#18181B',
  },
  
  border: {
    DEFAULT: '#3F3F46',
    strong: '#52525B',
    subtle: '#27272A',
  },
}

// Typ für TypeScript
export type DesignTokens = typeof designTokens
export type DarkDesignTokens = typeof darkDesignTokens