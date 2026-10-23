import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/apiClient'

export function useProducts(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })
  const query = searchParams.toString()

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient(`/api/products${query ? `?${query}` : ''}`),
    placeholderData: keepPreviousData,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient('/api/categories'),
    staleTime: Infinity,
  })
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient(`/api/products/${id}`),
    retry: (failureCount, error) => error?.status !== 404 && failureCount < 1,
  })
}