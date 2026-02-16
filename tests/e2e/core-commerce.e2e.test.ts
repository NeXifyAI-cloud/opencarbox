import { beforeEach, describe, expect, it, vi } from 'vitest';

import { featuredProducts } from '../../src/lib/mock-data';
import {
  findProductByTerm,
  runCheckout,
  validateCheckout,
} from '../../src/lib/commerce/checkout';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.stubGlobal('localStorage', localStorageMock);

const { useCartStore } = await import('../../src/stores/cart-store');

function resetStore() {
  useCartStore.setState({ items: [], isOpen: false });
}

describe('core commerce e2e flows', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it('Produkt finden -> in Warenkorb', () => {
    const product = findProductByTerm(featuredProducts, 'BOSCH Bremsscheiben');
    expect(product).toBeDefined();

    useCartStore.getState().addItem({
      id: String(product!.id),
      name: product!.name,
      price: product!.price,
      slug: `product-${product!.id}`,
    });

    const state = useCartStore.getState();

    expect(state.getTotalItems()).toBe(1);
    expect(state.items[0].name).toContain('BOSCH');
  });

  it('Checkout Happy Path', async () => {
    const checkout = validateCheckout({
      email: 'kunde@example.com',
      items: [{ id: 'p-1', name: 'Bremse', price: 70, quantity: 2 }],
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

    const result = await runCheckout(checkout, async () => ({
      success: true,
      transactionId: 'txn-123',
    }));

    expect(result.status).toBe('confirmed');
    expect(result.transactionId).toBe('txn-123');
    expect(result.totals.shipping).toBe(0);
  });

  it('Checkout Fehlerfall (Zahlung fehlgeschlagen)', async () => {
    const checkout = validateCheckout({
      email: 'kunde@example.com',
      items: [{ id: 'p-1', name: 'Bremse', price: 15, quantity: 1 }],
      shippingAddress: {
        firstName: 'Max',
        lastName: 'Mustermann',
        street: 'Musterstraße 1',
        zip: '10115',
        city: 'Berlin',
        country: 'DE',
      },
      shippingMethod: 'express',
      paymentMethod: 'card',
    });

    const result = await runCheckout(checkout, async () => ({
      success: false,
      error: 'payment_declined',
    }));

    expect(result.status).toBe('failed');
    expect(result.error).toBe('payment_declined');
  });
});
