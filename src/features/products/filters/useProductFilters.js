import { useSearchParams } from 'react-router-dom'

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    search: searchParams.get('search') ?? '',
    category: searchParams.get('category') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  }

  const setFilters = (changes) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(changes).forEach(([key, value]) => {
        if (value === '' || value == null) next.delete(key)
        else next.set(key, String(value))
      })
      if (!('page' in changes)) next.delete('page')
      return next
    })
  }

  return { filters, setFilters }
}