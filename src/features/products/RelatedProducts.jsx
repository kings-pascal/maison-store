import { useProducts } from './api'
import ProductGrid from './ProductGrid'

const relatedGridClass = 'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'

export default function RelatedProducts({ product }) {
  const query = useProducts({
    category: product.category,
    exclude: product.id,
    sort: 'rating',
    limit: 4,
  })

  if (query.isError) return null
  if (query.isSuccess && query.data.data.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-neutral-800 pt-10">
      <h2 id="related-heading" className="mb-6 text-xl font-bold text-white sm:text-2xl">
        You may also like
      </h2>
      <ProductGrid query={query} skeletonCount={4} gridClassName={relatedGridClass} />
    </section>
  )
}