import { z } from 'zod';

/**
 * DOS v1.1 Tracking Event Schemas
 * Jedes kritische Verhalten muss hier als validiertes Event definiert sein.
 * Keine PII (Personally Identifiable Information) in den Payloads erlaubt.
 */

// Basis-Schema für alle Events
export const BaseEventSchema = z.object({
  user_id: z.string().uuid().optional(), // Pseudonymisiert
  timestamp: z.string().datetime(),
  page_path: z.string(),
  funnel_stage: z.enum(['awareness', 'education', 'consideration', 'conversion', 'retention']),
  area: z.enum(['shop', 'werkstatt', 'autohandel', 'shared']),
});

// System Events
export const PageViewSchema = BaseEventSchema.extend({
  event: z.literal('page_view'),
  title: z.string().optional(),
  referrer: z.string().optional(),
});

export const CTAClickSchema = BaseEventSchema.extend({
  event: z.literal('cta_click'),
  cta_id: z.string(),
  cta_text: z.string(),
  target_url: z.string().optional(),
});

// Shop Events
export const HSNTSNLookupSchema = BaseEventSchema.extend({
  event: z.literal('hsn_tsn_lookup'),
  hsn: z.string().length(4),
  tsn: z.string().length(3).or(z.string().length(4)),
  success: z.boolean(),
});

export const ProductFilterSchema = BaseEventSchema.extend({
  event: z.literal('product_filter'),
  category: z.string(),
  filters: z.record(z.any()),
});

export const ProductViewSchema = BaseEventSchema.extend({
  event: z.literal('product_view'),
  product_id: z.string(),
  product_name: z.string(),
  price: z.number(),
  currency: z.string().default('EUR'),
});

export const AddToCartSchema = BaseEventSchema.extend({
  event: z.literal('add_to_cart'),
  product_id: z.string(),
  quantity: z.number(),
  value: z.number(),
});

export const PurchaseSchema = BaseEventSchema.extend({
  event: z.literal('purchase'),
  order_id: z.string(), // Order-UUID, keine PII
  value: z.number(),
  items_count: z.number(),
});

// Werkstatt Events
export const AppointmentStartSchema = BaseEventSchema.extend({
  event: z.literal('appointment_start'),
  service_type: z.string().optional(),
});

export const AppointmentBookedSchema = BaseEventSchema.extend({
  event: z.literal('appointment_booked'),
  appointment_id: z.string().uuid(),
  service_id: z.string(),
  slot_timestamp: z.string().datetime(),
});

export const AbandonAppointmentSchema = BaseEventSchema.extend({
  event: z.literal('abandon_appointment'),
  step: z.number(),
  reason: z.string().optional(),
});

// Autohandel Events
export const VehicleListingViewSchema = BaseEventSchema.extend({
  event: z.literal('vehicle_listing_view'),
  filters_applied: z.number(),
});

export const VehicleInquirySchema = BaseEventSchema.extend({
  event: z.literal('vehicle_inquiry'),
  vehicle_id: z.string(),
  inquiry_type: z.enum(['buy', 'financing', 'trade-in']),
});

// Exportiertes Tracking-Event-Objekt
export const TrackingEvents = {
  page_view: PageViewSchema,
  cta_click: CTAClickSchema,
  hsn_tsn_lookup: HSNTSNLookupSchema,
  product_filter: ProductFilterSchema,
  product_view: ProductViewSchema,
  add_to_cart: AddToCartSchema,
  purchase: PurchaseSchema,
  appointment_start: AppointmentStartSchema,
  appointment_booked: AppointmentBookedSchema,
  abandon_appointment: AbandonAppointmentSchema,
  vehicle_listing_view: VehicleListingViewSchema,
  vehicle_inquiry: VehicleInquirySchema,
};

export type TrackingEvent = z.infer<typeof PageViewSchema>
  | z.infer<typeof CTAClickSchema>
  | z.infer<typeof HSNTSNLookupSchema>
  | z.infer<typeof ProductFilterSchema>
  | z.infer<typeof ProductViewSchema>
  | z.infer<typeof AddToCartSchema>
  | z.infer<typeof PurchaseSchema>
  | z.infer<typeof AppointmentStartSchema>
  | z.infer<typeof AppointmentBookedSchema>
  | z.infer<typeof AbandonAppointmentSchema>
  | z.infer<typeof VehicleListingViewSchema>
  | z.infer<typeof VehicleInquirySchema>;
