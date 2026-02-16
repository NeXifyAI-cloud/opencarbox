import { describe, expect, it } from 'vitest';

import {
  calculateOrderTotals,
  calculateShipping,
  calculateSubtotal,
} from '../../src/lib/commerce/checkout';

describe('pricing and shipping logic', () => {
  it('calculates subtotal across line items', () => {
    const subtotal = calculateSubtotal([
      { id: 'p-1', name: 'A', price: 10, quantity: 2 },
      { id: 'p-2', name: 'B', price: 3.5, quantity: 3 },
    ]);

    expect(subtotal).toBe(30.5);
  });

  it('grants free standard shipping above threshold', () => {
    expect(calculateShipping(130, 'standard')).toBe(0);
    expect(calculateShipping(130, 'express')).toBe(12.99);
  });

  it('returns total summary', () => {
    const totals = calculateOrderTotals({
      email: 'kunde@example.com',
      items: [{ id: 'p-1', name: 'A', price: 50, quantity: 2 }],
      shippingAddress: {
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterstraße 1',
        zip: '10115',
        city: 'Berlin',
        country: 'DE',
      },
      shippingMethod: 'standard',
      paymentMethod: 'card',
    });

    expect(totals).toEqual({
      subtotal: 100,
      shipping: 4.99,
      tax: 20,
      grandTotal: 104.99,
    });
  });
});
