/**
 * TypeScript Typen - OpenCarBox & Carvantooo
 * 
 * Zentrale Typdefinitionen für die gesamte Anwendung.
 * Ergänzt die automatisch generierten Prisma-Typen.
 * 
 * @module types
 */

// =============================================================================
// RE-EXPORTS VON PRISMA
// =============================================================================

// Diese werden nach dem ersten `prisma generate` verfügbar sein:
// export type {
//   User,
//   Product,
//   Category,
//   Order,
//   OrderItem,
//   Vehicle,
//   Service,
//   Appointment,
//   Review,
// } from '@prisma/client';

// =============================================================================
// ALLGEMEINE TYPEN
// =============================================================================

/**
 * Standard-API-Antwort
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Paginierungs-Parameter
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Such-Parameter
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, string | number | boolean | string[]>;
}

// =============================================================================
// SHOP-TYPEN
// =============================================================================

/**
 * Produkt für die Anzeige im Frontend
 */
export interface ProductDisplay {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand: string | null;
  stock: number;
  isAvailable: boolean;
  rating: number | null;
  reviewCount: number;
}

/**
 * Warenkorb-Artikel
 */
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
  };
}

/**
 * Warenkorb
 */
export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

/**
 * Checkout-Daten
 */
export interface CheckoutData {
  shippingAddress: AddressInput;
  billingAddress?: AddressInput;
  sameAsBilling: boolean;
  shippingMethod: string;
  paymentMethod: string;
  customerNote?: string;
}

/**
 * Adress-Eingabe
 */
export interface AddressInput {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  streetNumber: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
}

// =============================================================================
// FAHRZEUG-TYPEN
// =============================================================================

/**
 * Fahrzeug für "Meine Garage"
 */
export interface VehicleDisplay {
  id: string;
  hsn: string | null;
  tsn: string | null;
  licensePlate: string | null;
  brand: string;
  model: string;
  variant: string | null;
  year: number;
  nickname: string | null;
  mileage: number | null;
  nextTuv: Date | null;
}

/**
 * HSN/TSN Lookup Ergebnis
 */
export interface VehicleLookupResult {
  brand: string;
  model: string;
  variant?: string;
  yearFrom: number;
  yearTo: number;
  engineType?: string;
  fuelType?: string;
  power?: string;
}

// =============================================================================
// WERKSTATT-TYPEN
// =============================================================================

/**
 * Service für die Anzeige
 */
export interface ServiceDisplay {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  priceFrom: number | null;
  priceTo: number | null;
  priceType: 'FIXED' | 'FROM' | 'ON_REQUEST';
  durationMinutes: number | null;
  image: string | null;
}

/**
 * Verfügbarer Zeitslot
 */
export interface TimeSlot {
  time: string; // z.B. "09:00"
  available: boolean;
}

/**
 * Terminbuchungs-Daten
 */
export interface BookingData {
  serviceId: string;
  date: Date;
  timeSlot: string;
  vehicle?: {
    hsn?: string;
    tsn?: string;
    brand: string;
    model: string;
    year: number;
    licensePlate?: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  note?: string;
}

// =============================================================================
// UI-TYPEN
// =============================================================================

/**
 * Toast-Benachrichtigung
 */
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Breadcrumb-Item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Navigation-Item
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number;
}

// =============================================================================
// FORM-TYPEN (Zod Schemas werden in lib/validators.ts definiert)
// =============================================================================

/**
 * Formular-Fehler
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Formular-Status
 */
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: FormError[];
}

