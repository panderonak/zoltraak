import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  actions: CartActions;
};

type CartActions = {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      actions: {
        addItem: (product) =>
          set((state) => {
            const existing = state.items.find(
              (item) => item.product.id === product.id,
            );

            if (existing) {
              return {
                items: state.items.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                ),
              };
            }

            return {
              items: [...state.items, { product, quantity: 1 }],
            };
          }),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.product.id !== id),
          })),
        clearCart: () => set({ items: [] }),
        increaseQuantity: (id) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          })),
        decreaseQuantity: (id) =>
          set((state) => ({
            items: state.items
              .map((item) =>
                item.product.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              )
              .filter((item) => item.quantity > 0),
          })),
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
