import { useCartStore } from './cartStore'

const base =
  'rounded-full px-8 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function AddToCartButton({ product, className = '' }) {
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  if (!product.inStock) {
    return (
      <button
        type="button"
        disabled
        className={`${base} cursor-not-allowed bg-neutral-800 text-neutral-400 ${className}`}
      >
        Out of stock
      </button>
    )
  }

  const handleClick = () => {
    addItem(product)
    openCart()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} bg-white text-black hover:bg-neutral-200 ${className}`}
    >
      Add to cart
    </button>
  )
}