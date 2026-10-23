import { Link, useParams } from 'react-router-dom'
import { useProduct } from '../features/products/api'
import ProductDetailSkeleton from '../features/products/ProductCardSkeleton'
import RelatedProducts from '../features/products/RelatedProducts'
import AddToCartButton from '../features/cart/AddToCartButton'
import WishlistButton from '../features/wishlist/WishlistButton'
import { detailGridClass } from '../features/products/detailLayout'
import ProductImage from '../components/ui/ProductImage'
import { formatPrice } from '../lib/formatPrice'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: product, isPending, isError, error, refetch } = useProduct(id)

  let content

  if (isPending) {
    content = <ProductDetailSkeleton />
  } else if (isError && error.status === 404) {
    content = (
      <div className="py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-neutral-400">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Fragrance not found</h1>
        <p className="mt-2 text-neutral-400">We couldn't find the product you're looking for.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
        >
          Browse all fragrances
        </Link>
      </div>
    )
  } else if (isError) {
    content = (
      <div role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-8 text-center">
        <p className="text-lg font-medium text-white">We couldn't load this product.</p>
        <p className="mt-1 text-sm text-red-300">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
        >
          Try again
        </button>
      </div>
    )
  } else {
    content = (
      <div className={detailGridClass}>
        <ProductImage key={product.id} src={product.image} name={product.name} priority />

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-neutral-400 sm:text-xs">
            {product.category}
          </p>
          <h1 className="mt-1 text-xl font-bold text-white sm:mt-2 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-white sm:mt-4 sm:text-2xl">
            {formatPrice(product.price)}
          </p>
          <p
            className="mt-1 text-xs text-neutral-400 sm:mt-2 sm:text-sm"
            aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}
          >
            ★ {product.rating} ({product.reviews} reviews)
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-300 sm:mt-6 sm:text-base">
            {product.description}
          </p>

          <h2 className="mt-5 text-xs uppercase tracking-wider text-neutral-400 sm:mt-8">Notes</h2>
          <ul className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            {product.notes.map((note) => (
              <li
                key={note}
                className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-200 sm:px-4 sm:py-1.5 sm:text-sm"
              >
                {note}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs text-neutral-400 sm:mt-8 sm:text-sm">
            {product.size} ml · {product.inStock ? 'In stock' : 'Currently out of stock'}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
            <AddToCartButton product={product} className="w-full sm:w-auto" />
            <WishlistButton product={product} variant="full" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="mb-8 inline-block text-sm text-neutral-400 hover:text-white"
        >
          ← All fragrances
        </Link>
        {content}
        {product && <RelatedProducts product={product} />}
      </div>
    </div>
  )
}