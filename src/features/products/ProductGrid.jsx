import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import Reveal from '../../components/ui/Reveal'

const defaultGridClass = 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4'

export default function ProductGrid({
  query,
  skeletonCount = 8,
  gridClassName = defaultGridClass,
}) {
  const { data, isPending, isError, error, refetch, isPlaceholderData } = query

  if (isPending) {
    return (
      <ul className={gridClassName} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-8 text-center">
        <p className="text-lg font-medium text-white">We couldn't load the products.</p>
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
  }

  if (data.data.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 p-10 text-center">
        <p className="text-lg font-medium text-white">No products found</p>
        <p className="mt-1 text-sm text-neutral-400">Try a different search or filter.</p>
      </div>
    )
  }

  return (
    <ul
      aria-busy={isPlaceholderData}
      className={`${gridClassName} transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}
    >
      {data.data.map((product, index) => (
        <Reveal as="li" key={product.id} delay={(index % 4) * 0.06}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </ul>
  )
}