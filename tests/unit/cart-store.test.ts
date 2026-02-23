import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../../src/lib/shop/cart-store';

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should start with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getTotalItems()).toBe(0);
    expect(state.getTotalPrice()).toBe(0);
  });

  it('should add an item to the cart', () => {
    const item = { id: '1', name: 'Bremsscheibe', price: 89.99, quantity: 1 };
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(item);
    expect(state.getTotalItems()).toBe(1);
    expect(state.getTotalPrice()).toBe(89.99);
  });

  it('should increment quantity if item already in cart', () => {
    const item = { id: '1', name: 'Bremsscheibe', price: 89.99, quantity: 1 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem({ ...item, quantity: 2 });

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
    expect(state.getTotalItems()).toBe(3);
  });

  it('should remove an item from the cart', () => {
    const item = { id: '1', name: 'Bremsscheibe', price: 89.99, quantity: 1 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem('1');

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('should update quantity correctly', () => {
    const item = { id: '1', name: 'Bremsscheibe', price: 89.99, quantity: 1 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().updateQuantity('1', 5);

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
  });
});
