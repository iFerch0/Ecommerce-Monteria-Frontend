'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity, size, color) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === (size || null) &&
            item.selectedColor === (color || null)
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: Math.max(quantity, product.minWholesaleQty),
                selectedSize: size || null,
                selectedColor: color || null,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const items = get().items.map((item) => {
          if (item.product.id === productId) {
            return {
              ...item,
              quantity: Math.max(quantity, item.product.minWholesaleQty),
            };
          }
          return item;
        });
        set({ items });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.basePrice * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-monteria-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
