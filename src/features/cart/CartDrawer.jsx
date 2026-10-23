import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProductImage from '../../components/ui/ProductImage'
import { formatPrice } from '../../lib/formatPrice'
import { MAX_QUANTITY, selectSubtotal, selectTotalItems, useCartStore } from './cartStore'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

function CartPanel() {
  const items = useCartStore((state) => state.items)
  const totalItems = useCartStore(selectTotalItems)
  const subtotal = useCartStore(selectSubtotal)
  const closeCart = useCartStore((state) => state.closeCart)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeButtonRef.current?.focus({ preventScroll: true })

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeCart()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [closeCart])

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={closeCart}
        aria-hidden="true"
        className="absolute inset-0 bg-black/60"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-neutral-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 id="cart-title" className="text-lg font-semibold text-white">
            Your cart{totalItems > 0 && ` (${totalItems})`}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-neutral-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-lg font-medium text-white">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-400">
              Find a fragrance you love and it will appear here.
            </p>
            <Link
              to="/products"
              onClick={closeCart}
              className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
            >
              Browse fragrances
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4"
                  >
                    <ProductImage
                      src={item.image}
                      name={item.name}
                      fallbackTextClass="text-2xl"
                      className="w-20 shrink-0"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            onClick={closeCart}
                            className="block truncate text-sm font-medium text-white hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs uppercase tracking-wider text-neutral-400">
                            {item.category}
                          </p>
                        </div>
                        <p className="text-sm text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-neutral-700">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 text-white disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm text-white" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={item.quantity >= MAX_QUANTITY}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 text-white disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-neutral-400 underline underline-offset-4 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="border-t border-neutral-800 px-5 py-5">
              <div className="flex items-center justify-between text-white">
                <span>Subtotal</span>
                <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                Shipping and taxes are calculated at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="mt-4 block w-full rounded-full bg-white py-3 text-center text-sm font-medium text-black hover:bg-neutral-200"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 w-full py-2 text-sm text-neutral-400 hover:text-white"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen)

  return <AnimatePresence>{isOpen && <CartPanel key="cart" />}</AnimatePresence>
}