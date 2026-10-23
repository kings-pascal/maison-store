import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const toSnapshot = ({ id, name, category, price, rating, reviews, image, inStock }) => ({
  id,
  name,
  category,
  price,
  rating,
  reviews,
  image,
  inStock,
})

export const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],

      toggleItem: (product) =>
        set((state) => {
          const isSaved = state.items.some((item) => item.id === product.id)
          return {
            items: isSaved
              ? state.items.filter((item) => item.id !== product.id)
              : [toSnapshot(product), ...state.items],
          }
        }),
    }),
    {
      name: 'maison-wishlist',
      version: 1,
    },
  ),
)

export const selectWishlistCount = (state) => state.items.length