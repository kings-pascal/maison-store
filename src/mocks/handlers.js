import { http, HttpResponse, delay } from 'msw'
import { products } from './data/products'
import { categories } from './data/categories'

const NETWORK_DELAY = 600

export const handlers = [
  http.get('/api/categories', async () => {
    await delay(NETWORK_DELAY)
    return HttpResponse.json(categories)
  }),

  http.get('/api/products', async ({ request }) => {
    const url = new URL(request.url)
    if (url.searchParams.get('fail') === 'true') {
    await delay(NETWORK_DELAY)
    return HttpResponse.json({ message: 'Simulated server error' }, { status: 500 })
    }
    
    
    const exclude = url.searchParams.get('exclude') // new
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const category = url.searchParams.get('category')
    const featured = url.searchParams.get('featured')
    const sort = url.searchParams.get('sort') ?? 'newest'
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 8)

    let result = [...products]

    if (category) result = result.filter((p) => p.category === category)
    if (exclude) result = result.filter((p) => p.id !== Number(exclude))
    if (featured === 'true') result = result.filter((p) => p.featured)
    if (search) {
      result = result.filter((p) =>
        [p.name, p.description, ...p.notes].join(' ').toLowerCase().includes(search)
      )
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }

    const total = result.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const data = result.slice(start, start + limit)

    await delay(NETWORK_DELAY)
    return HttpResponse.json({
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    })
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(NETWORK_DELAY)
    const product = products.find((p) => p.id === Number(params.id))
    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),
] 