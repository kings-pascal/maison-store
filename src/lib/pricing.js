export const SHIPPING_FLAT = 10
export const FREE_SHIPPING_THRESHOLD = 200
export const TAX_RATE = 0.08

const toCents = (value) => Math.round(value * 100) / 100

export function calculateTotals(subtotal) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const tax = toCents(subtotal * TAX_RATE)
  const total = toCents(subtotal + shipping + tax)
  return { subtotal, shipping, tax, total }
}