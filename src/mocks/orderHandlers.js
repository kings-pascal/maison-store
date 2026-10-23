import { http, HttpResponse, delay } from 'msw'
import { products } from './data/products'
import { calculateTotals } from '../lib/pricing'

const STORAGE_KEY = 'maison-mock-orders'
const NETWORK_DELAY = 900
const CUSTOMER_FIELDS = ['email', 'fullName', 'address', 'city', 'postalCode', 'country']

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

const saveOrder = (order) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...readOrders()].slice(0, 20)))
}

const createOrderId = () =>
  `MS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`

const isFilled = (value) => typeof value === 'string' && value.trim().length > 0

const fail = (message, status) => HttpResponse.json({ message }, { status })

export const orderHandlers = [
  http.post('/api/orders', async ({ request }) => {
    await delay(NETWORK_DELAY)

    const body = await request.json().catch(() => null)
    const customer = body?.customer
    const requested = body?.items

    if (!Array.isArray(requested) || requested.length === 0) {
      return fail('Your cart is empty.', 400)
    }
    if (!customer || !CUSTOMER_FIELDS.every((field) => isFilled(customer[field]))) {
      return fail('Some shipping details are missing.', 400)
    }

    // Test hook: an email starting with "fail@" simulates a server failure
    if (customer.email.trim().toLowerCase().startsWith('fail@')) {
      return fail('Our payment service is unavailable. Please try again.', 500)
    }

    // The server looks up real prices. It never trusts prices sent by the browser.
    const lines = []
    for (const entry of requested) {
      const product = products.find((p) => p.id === Number(entry.id))
      const quantity = Number(entry.quantity)

      if (!product) return fail('An item in your cart is no longer available.', 409)
      if (!product.inStock) return fail(`${product.name} is out of stock.`, 409)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return fail('One of the quantities is invalid.', 400)
      }

      lines.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      })
    }

    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

    const order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      customer: Object.fromEntries(
        CUSTOMER_FIELDS.map((field) => [field, customer[field].trim()]),
      ),
      items: lines,
      ...calculateTotals(subtotal),
    }

    saveOrder(order)
    return HttpResponse.json(order, { status: 201 })
  }),

  http.get('/api/orders/:id', async ({ params }) => {
    await delay(500)
    const order = readOrders().find((item) => item.id === params.id)
    if (!order) return fail('Order not found', 404)
    return HttpResponse.json(order)
  }),
]