import { describe, expect, it } from 'vitest';

import { validateCheckout } from '../../src/lib/commerce/checkout';

const validPayload = {
  email: 'kunde@example.com',
  items: [{ id: 'p-1', name: 'Bremsbelag', price: 49.99, quantity: 2 }],
  shippingAddress: {
    firstName: 'Max',
    lastName: 'Mustermann',
    street: 'Musterstraße 1',
    zip: '10115',
    city: 'Berlin',
    country: 'DE',
  },
  shippingMethod: 'standard' as const,
  paymentMethod: 'card' as const,
};

describe('checkout validators', () => {
  it('accepts a valid checkout payload', () => {
    const parsed = validateCheckout(validPayload);
    expect(parsed.email).toBe('kunde@example.com');
    expect(parsed.items[0].quantity).toBe(2);
  });

  it('rejects invalid email', () => {
    expect(() =>
      validateCheckout({
        ...validPayload,
        email: 'invalid',
      })
    ).toThrow();
  });

  it('rejects empty cart', () => {
    expect(() =>
      validateCheckout({
        ...validPayload,
        items: [],
      })
    ).toThrow();
  });
});
