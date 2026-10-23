import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/apiClient'

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload) =>
      apiClient('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
  })
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => apiClient(`/api/orders/${id}`),
    retry: (failureCount, error) => error?.status !== 404 && failureCount < 1,
  })
}