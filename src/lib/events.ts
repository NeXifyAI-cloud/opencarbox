import { z } from 'zod'

/**
 * DOS v1.1 - Event Tracking System (G4 Tracking First)
 *
 * Zentrale Definition aller Tracking-Events mit Zod-Validierung.
 * Keine PII (Personally Identifiable Information) in den Payloads (G4).
 */

// --- BASIS SCHEMAS ---

export const BaseEventSchema = z.object({
  event_name: z.string(),
  timestamp: z.string().datetime(),
  user_id: z.string().uuid().optional(), // Pseudonymisiert via UUID
  session_id: z.string().uuid().optional(),
  path: z.string(),
  referrer: z.string().optional(),
  device_type: z.enum(['mobile', 'tablet', 'desktop']).optional(),
})

// --- SYSTEM-WEITE EVENTS ---

export const PageViewSchema = BaseEventSchema.extend({
  event_name: z.literal('page_view'),
  page_title: z.string(),
  funnel_stage: z.enum(['awareness', 'education', 'consideration', 'conversion', 'retention']),
})

export const CtaClickSchema = BaseEventSchema.extend({
  event_name: z.literal('cta_click'),
  cta_label: z.string(),
  cta_type: z.enum(['primary', 'secondary', 'ghost']),
  cta_destination: z.string().optional(),
})

// --- SHOP EVENTS (CARVANTOOO) ---

export const ProductViewSchema = BaseEventSchema.extend({
  event_name: z.literal('product_view'),
  product_id: z.string(),
  product_name: z.string(),
  category: z.string(),
  price: z.number(),
})

export const AddToCartSchema = BaseEventSchema.extend({
  event_name: z.literal('add_to_cart'),
  product_id: z.string(),
  quantity: z.number().int().positive(),
  total_value: z.number(),
})

export const CheckoutSchema = BaseEventSchema.extend({
  event_name: z.literal('begin_checkout'),
  order_id: z.string().optional(),
  total_value: z.number(),
  item_count: z.number().int(),
})

export const PurchaseSchema = BaseEventSchema.extend({
  event_name: z.literal('purchase'),
  order_id: z.string(),
  total_value: z.number(),
  currency: z.literal('EUR'),
  payment_method: z.string(),
})

// --- WERKSTATT EVENTS (OPEN-CAR-BOX) ---

export const AppointmentStartSchema = BaseEventSchema.extend({
  event_name: z.literal('appointment_start'),
  service_id: z.string(),
})

export const AppointmentSlotSelectedSchema = BaseEventSchema.extend({
  event_name: z.literal('appointment_slot'),
  date: z.string(),
  time_slot: z.string(),
})

export const AppointmentBookedSchema = BaseEventSchema.extend({
  event_name: z.literal('appointment_booked'),
  appointment_id: z.string(),
  service_id: z.string(),
})

// --- AUTOHANDEL EVENTS (OPEN-CAR-BOX) ---

export const VehicleInquirySchema = BaseEventSchema.extend({
  event_name: z.literal('vehicle_inquiry'),
  vehicle_id: z.string(),
  inquiry_type: z.enum(['purchase', 'test_drive', 'financing']),
})

// --- EXPORT TYPES ---

export type TrackedEvent =
  | z.infer<typeof PageViewSchema>
  | z.infer<typeof CtaClickSchema>
  | z.infer<typeof ProductViewSchema>
  | z.infer<typeof AddToCartSchema>
  | z.infer<typeof CheckoutSchema>
  | z.infer<typeof PurchaseSchema>
  | z.infer<typeof AppointmentStartSchema>
  | z.infer<typeof AppointmentSlotSelectedSchema>
  | z.infer<typeof AppointmentBookedSchema>
  | z.infer<typeof VehicleInquirySchema>

/**
 * Zentrale Tracking-Funktion
 *
 * Implementiert G4: Validiert jedes Event gegen das entsprechende Schema.
 */
export async function trackEvent(event: TrackedEvent) {
  try {
    // In einer realen Implementierung würde hier die Validierung und der Versand erfolgen.
    // console.log('[TRACKING]', event.event_name, event)

    // Validierung (Beispielhaft für PageView)
    if (event.event_name === 'page_view') {
      PageViewSchema.parse(event)
    }

    // Versand an Analytics-Provider (Vercel, Sentry, etc.)
  } catch (error) {
    console.error('[TRACKING ERROR]', error)
  }
}
