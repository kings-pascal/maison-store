import { motion } from 'framer-motion'
import HeartIcon from '../../components/ui/HeartIcon'
import { useWishlistStore } from './wishlistStore'

const focusClass =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function WishlistButton({ product, variant = 'icon', className = '' }) {
  const isSaved = useWishlistStore((state) => state.items.some((item) => item.id === product.id))
  const toggleItem = useWishlistStore((state) => state.toggleItem)
  const heartColor = isSaved ? 'text-rose-400' : 'text-white'

  if (variant === 'full') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        aria-pressed={isSaved}
        onClick={() => toggleItem(product)}
        className={`flex items-center justify-center gap-2 rounded-full border border-neutral-600 px-6 py-3 text-sm transition-colors hover:border-white ${heartColor} ${focusClass} ${className}`}
      >
        <HeartIcon filled={isSaved} />
        <span className="text-white">Wishlist</span>
      </motion.button>
    )
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      aria-pressed={isSaved}
      aria-label={`Save ${product.name} to wishlist`}
      onClick={() => toggleItem(product)}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70 ${heartColor} ${focusClass} ${className}`}
    >
      <HeartIcon filled={isSaved} />
    </motion.button>
  )
}