const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// Resolves once the mock API (if used) is ready. Requests wait for it, but the page does not.
let apiReady = Promise.resolve()

export function setApiReady(promise) {
  apiReady = promise
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiClient(path, options) {
  await apiReady

  const response = await fetch(`${BASE_URL}${path}`, options)

  if (!response.ok) {
    let message = 'Something went wrong'
    try {
      const body = await response.json()
      message = body.message ?? message
    } catch {
      // the error response had no JSON body, keep the default message
    }
    throw new ApiError(message, response.status)
  }

  return response.json()
}