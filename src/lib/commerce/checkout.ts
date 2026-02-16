import { z } from 'zod';

const checkoutItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  street: z.string().trim().min(3),
  zip: z.string().trim().regex(/^\d{4,5}$/),
  city: z.string().trim().min(2),
  country: z.string().trim().length(2),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  items: z.array(checkoutItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['card', 'invoice']),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
};

const FREE_SHIPPING_THRESHOLD = 120;
const STANDARD_SHIPPING = 4.99;
const EXPRESS_SHIPPING = 12.99;
const TAX_RATE = 0.2;

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function validateCheckout(input: unknown): CheckoutInput {
  return checkoutSchema.parse(input);
}

export function calculateSubtotal(items: CheckoutInput['items']): number {
  return roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

export function calculateShipping(subtotal: number, method: CheckoutInput['shippingMethod']): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD && method === 'standard') {
    return 0;
  }

  return method === 'express' ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
}

export function calculateOrderTotals(input: CheckoutInput): OrderTotals {
  const subtotal = calculateSubtotal(input.items);
  const shipping = calculateShipping(subtotal, input.shippingMethod);
  const tax = roundCurrency(subtotal * TAX_RATE);

  return {
    subtotal,
    shipping,
    tax,
    grandTotal: roundCurrency(subtotal + shipping),
  };
}

export type PaymentGateway = (amount: number, method: CheckoutInput['paymentMethod']) => Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}>;

export async function runCheckout(input: CheckoutInput, paymentGateway: PaymentGateway) {
  const totals = calculateOrderTotals(input);
  const payment = await paymentGateway(totals.grandTotal, input.paymentMethod);

  if (!payment.success) {
    return {
      status: 'failed' as const,
      totals,
      error: payment.error ?? 'Payment failed',
    };
  }

  return {
    status: 'confirmed' as const,
    totals,
    transactionId: payment.transactionId,
  };
}

export function findProductByTerm<T extends { name: string }>(products: T[], term: string): T | undefined {
  const normalizedTerm = term.trim().toLowerCase();
  return products.find((product) => product.name.toLowerCase().includes(normalizedTerm));
}
