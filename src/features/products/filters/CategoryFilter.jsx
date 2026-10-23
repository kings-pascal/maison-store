import { useCategories } from '../api'
import Skeleton from '../../../components/ui/Skeleton'

export default function CategoryFilter({ value, onChange }) {
  const { data: categories = [], isPending } = useCategories()
  const options = [{ id: '', name: 'All' }, ...categories]

  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {isPending
        ? Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))
        : options.map((option) => {
            const active = value === option.id
            return (
              <button
                key={option.id || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-white bg-white text-black'
                    : 'border-neutral-700 text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {option.name}
              </button>
            )
          })}
    </div>
  )
}