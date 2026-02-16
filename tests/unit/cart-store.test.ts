import { beforeEach, describe, expect, it, vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.stubGlobal('localStorage', localStorageMock);

const { useCartStore } = await import('../../src/stores/cart-store');

function resetCartStore() {
  useCartStore.setState({
    items: [],
    isOpen: false,
  });
}

describe('cart store', () => {
  beforeEach(() => {
    resetCartStore();
    vi.clearAllMocks();
  });

  it('adds a new item with quantity 1', () => {
    useCartStore.getState().addItem({
      id: 'p-1',
      name: 'Bremsscheibe',
      price: 89.99,
      slug: 'bremsscheibe',
    });

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 'p-1', quantity: 1 });
    expect(state.getTotalItems()).toBe(1);
    expect(state.getTotalPrice()).toBe(89.99);
  });

  it('increments quantity when adding same item again', () => {
    const item = {
      id: 'p-1',
      name: 'Bremsscheibe',
      price: 89.99,
      slug: 'bremsscheibe',
    };

    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.getTotalItems()).toBe(2);
  });

  it('removes item when quantity updated to zero', () => {
    useCartStore.getState().addItem({
      id: 'p-1',
      name: 'Bremsscheibe',
      price: 89.99,
      slug: 'bremsscheibe',
    });

    useCartStore.getState().updateQuantity('p-1', 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
