import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'framer-motion'
import ProductImage from '../../components/ui/ProductImage'
import WishlistButton from '../wishlist/WishlistButton'
import { formatPrice } from '../../lib/formatPrice'

const GLOW_COLORS = {
  woody: '#e0a458',
  floral: '#f08fb0',
  fresh: '#6fd6c4',
  oriental: '#f2c14e',
}

export default function ProductCard({ product }) {
  const { id, name, category, price, rating, reviews, image, inStock } = product
  const ref = useRef(null)
  const revealed = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <div
      ref={ref}
      data-glow={revealed ? 'on' : 'off'}
      style={{ '--glow-color': GLOW_COLORS[category] ?? '#ffffff' }}
      className="group relative"
    >
      <Link
        to={`/products/${id}`}
        className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <article>
          <ProductImage src={image} name={name}>
            <span aria-hidden="true" className="glow-ring glow-ring--sweep" />
            <span aria-hidden="true" className="glow-ring glow-ring--hover" />
            {!inStock && (
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                Out of stock
              </span>
            )}
          </ProductImage>

          <div className="mt-3 space-y-1">
            <p className="text-xs uppercase tracking-wider text-neutral-400">{category}</p>
            <h3 className="text-base font-medium text-white">{name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">{formatPrice(price)}</span>
              <span
                className="text-neutral-400"
                aria-label={`Rated ${rating} out of 5 from ${reviews} reviews`}
              >
                ★ {rating} ({reviews})
              </span>
            </div>
          </div>
        </article>
      </Link>

      <WishlistButton product={product} className="absolute right-3 top-3" />
    </div>
  )
}