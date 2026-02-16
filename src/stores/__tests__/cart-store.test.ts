import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCartStore } from '../cart-store';

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('useCartStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', localStorageMock);
    useCartStore.setState({ items: [], isOpen: false });
  });

  it('adds items and calculates totals', () => {
    useCartStore.getState().addItem({
      id: 'sku-1',
      name: 'Bremsbeläge',
      price: 49.99,
      slug: 'bremsbelaege',
    });

    useCartStore.getState().addItem({
      id: 'sku-1',
      name: 'Bremsbeläge',
      price: 49.99,
      slug: 'bremsbelaege',
    });

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.getTotalItems()).toBe(2);
    expect(state.getTotalPrice()).toBeCloseTo(99.98);
  });

  it('updates quantity and removes item when quantity is <= 0', () => {
    useCartStore.getState().addItem({
      id: 'sku-1',
      name: 'Bremsbeläge',
      price: 49.99,
      slug: 'bremsbelaege',
    });

    useCartStore.getState().updateQuantity('sku-1', 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);

    useCartStore.getState().updateQuantity('sku-1', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears cart and toggles mini-cart open state', () => {
    useCartStore.getState().addItem({
      id: 'sku-2',
      name: 'Ölfilter',
      price: 18.5,
      slug: 'oelfilter',
    });

    useCartStore.getState().setIsOpen(true);
    expect(useCartStore.getState().isOpen).toBe(true);

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
