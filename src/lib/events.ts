import { z } from 'zod';
import { logger } from '@/lib/logger';

/**
 * DOS v1.1 - G4: Tracking First
 * Alle kritischen Verhalten werden hier als Zod-validierte Events definiert.
 */

// Basis-Schema für alle Events
const BaseEventSchema = z.object({
  user_id: z.string().uuid().optional(), // Pseudonymisierte UUID
  session_id: z.string().optional(),
  timestamp: z.string().datetime(),
  url: z.string().url(),
  funnel_stage: z.enum(['AWARENESS', 'EDUCATION', 'CONSIDERATION', 'CONVERSION', 'RETENTION']),
  domain: z.enum(['SHOP', 'WERKSTATT', 'AUTOHANDEL', 'SHARED']),
});

// Shop-spezifische Events
export const ShopEventSchema = BaseEventSchema.extend({
  domain: z.literal('SHOP'),
  event_name: z.enum([
    'page_view',
    'cta_click',
    'search_internal',
    'hsn_tsn_lookup',
    'product_filter',
    'product_view',
    'add_to_cart',
    'begin_checkout',
    'purchase',
    'garage_vehicle_added',
  ]),
  metadata: z.record(z.unknown()).optional(),
});

// Werkstatt-spezifische Events
export const WerkstattEventSchema = BaseEventSchema.extend({
  domain: z.literal('WERKSTATT'),
  event_name: z.enum([
    'service_view',
    'appointment_start',
    'appointment_vehicle',
    'appointment_slot',
    'appointment_contact',
    'appointment_booked',
    'abandon_appointment',
    'error_displayed',
  ]),
  metadata: z.record(z.unknown()).optional(),
});

// Autohandel-spezifische Events
export const AutohandelEventSchema = BaseEventSchema.extend({
  domain: z.literal('AUTOHANDEL'),
  event_name: z.enum([
    'vehicle_listing_view',
    'vehicle_detail_view',
    'vehicle_inquiry',
    'financing_calculator',
  ]),
  metadata: z.record(z.unknown()).optional(),
});

export type ShopEvent = z.infer<typeof ShopEventSchema>;
export type WerkstattEvent = z.infer<typeof WerkstattEventSchema>;
export type AutohandelEvent = z.infer<typeof AutohandelEventSchema>;

/**
 * Zentraler Tracker
 */
export async function trackEvent(event: ShopEvent | WerkstattEvent | AutohandelEvent) {
  // In einer echten Implementierung würden wir hier an ein Analytics-Backend
  // oder eine eigene DB senden (z.B. Tinybird oder Supabase).
  logger.info(`[TRACKING] ${event.event_name}`, event);

  // DSGVO-Check: Keine PII in Metadata
  const piiPatterns = [/email/i, /phone/i, /name/i, /address/i];
  const metadataString = JSON.stringify(event.metadata || {});

  if (piiPatterns.some(pattern => pattern.test(metadataString))) {
    logger.warn('[TRACKING] PII detected in metadata! Event might be blocked in production.');
  }

  return true;
}
