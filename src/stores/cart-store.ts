import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Warenkorb-Artikel Interface
 */
interface CartItem {
  /** Produkt-ID */
  id: string;
  /** Produktname */
  name: string;
  /** Einzelpreis in Euro */
  price: number;
  /** Menge */
  quantity: number;
  /** Bild-URL */
  image?: string;
  /** Produkt-Slug für Links */
  slug: string;
  /** SKU / Artikelnummer */
  sku?: string;
}

/**
 * Warenkorb-State Interface
 */
interface CartState {
  /** Alle Artikel im Warenkorb */
  items: CartItem[];
  /** Ist der Warenkorb offen (Mini-Cart)? */
  isOpen: boolean;

  // Actions
  /** Artikel hinzufügen oder Menge erhöhen */
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  /** Artikel entfernen */
  removeItem: (id: string) => void;
  /** Menge eines Artikels ändern */
  updateQuantity: (id: string, quantity: number) => void;
  /** Warenkorb leeren */
  clearCart: () => void;
  /** Mini-Cart öffnen/schließen */
  setIsOpen: (isOpen: boolean) => void;

  // Computed Values (als Properties für einfache Verwendung)
  /** Gesamtanzahl der Artikel */
  itemCount: number;
  /** Gesamtpreis aller Artikel */
  totalPrice: number;

  // Legacy Getter-Funktionen (für Abwärtskompatibilität)
  /** Gesamtanzahl der Artikel */
  getTotalItems: () => number;
  /** Gesamtpreis aller Artikel */
  getTotalPrice: () => number;
}

/**
 * Warenkorb-Store mit Persistenz in localStorage.
 *
 * @example
 * const { items, addItem, removeItem, getTotalPrice } = useCartStore();
 *
 * // Artikel hinzufügen
 * addItem({ id: '1', name: 'Bremsbeläge', price: 49.99, slug: 'bremsbelaege' });
 *
 * // Gesamtpreis berechnen
 * const total = getTotalPrice(); // 49.99
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Computed values als getter-Properties
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Menge erhöhen
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }

          // Neuen Artikel hinzufügen
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'carvantooo-cart', // localStorage-Key
      storage: createJSONStorage(() => localStorage),
      // Nur items persistieren, nicht UI-State
      partialize: (state) => ({ items: state.items }),
    }
  )
);
