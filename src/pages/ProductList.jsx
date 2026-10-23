import { useProducts } from '../features/products/api'
import ProductGrid from '../features/products/ProductGrid'
import SearchBar from '../features/products/filters/SearchBar'
import CategoryFilter from '../features/products/filters/CategoryFilter'
import SortSelect from '../features/products/filters/SortSelect'
import { useProductFilters } from '../features/products/filters/useProductFilters'
import Pagination from '../components/ui/Pagination'

const PAGE_SIZE = 8

export default function ProductList() {
  const { filters, setFilters } = useProductFilters()
  const query = useProducts({ ...filters, limit: PAGE_SIZE })
  const hasFilters = filters.search || filters.category || filters.sort !== 'newest'

  return (
    <div className="min-h-screen bg-neutral-900 px-6 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-white">All fragrances</h1>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="md:w-80">
              <SearchBar value={filters.search} onSearch={(search) => setFilters({ search })} />
            </div>
            <SortSelect value={filters.sort} onChange={(sort) => setFilters({ sort })} />
          </div>
          <CategoryFilter
            value={filters.category}
            onChange={(category) => setFilters({ category })}
          />
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-neutral-400">
          <p aria-live="polite">
            {query.data ? `${query.data.total} fragrances` : '\u00A0'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setFilters({ search: '', category: '', sort: '' })}
              className="underline underline-offset-4 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>

        <ProductGrid query={query} skeletonCount={PAGE_SIZE} />

        <Pagination
          page={filters.page}
          totalPages={query.data?.totalPages ?? 1}
          onPageChange={(page) => setFilters({ page: page === 1 ? '' : page })}
        />
      </div>
    </div>
  )
}