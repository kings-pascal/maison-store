import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from '../features/products/ProductCard'
import { useWishlistStore } from '../features/wishlist/wishlistStore'

const gridClass = 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4'

export default function Wishlist() {
  const items = useWishlistStore((state) => state.items)

  return (
    <div className="min-h-screen bg-neutral-900 px-6 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold text-white">Wishlist</h1>
        <p className="mb-10 text-sm text-neutral-400" aria-live="polite">
          {items.length} saved {items.length === 1 ? 'fragrance' : 'fragrances'}
        </p>

        {items.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 p-10 text-center">
            <p className="text-lg font-medium text-white">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-neutral-400">
              Tap the heart on any fragrance to save it here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
            >
              Browse fragrances
            </Link>
          </div>
        ) : (
          <ul className={gridClass}>
            <AnimatePresence initial={false}>
              {items.map((product) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}