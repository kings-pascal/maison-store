import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_QUANTITY = 10

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
                  : item,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                quantity: Math.min(MAX_QUANTITY, quantity),
              },
            ],
          }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }
              : item,
          ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'maison-cart',
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const selectTotalItems = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectSubtotal = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)