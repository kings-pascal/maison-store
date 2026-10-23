import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SelectField, TextField } from '../components/ui/field'
import ProductImage from '../components/ui/ProductImage'
import { selectSubtotal, useCartStore } from '../features/cart/cartStore'
import { useCreateOrder } from '../features/checkout/api'
import { COUNTRIES, FIELD_ORDER, validateCheckout } from '../features/checkout/validate'
import { FREE_SHIPPING_THRESHOLD, calculateTotals } from '../lib/pricing'
import { formatMoney } from '../lib/formatPrice'

const initialValues = {
  email: '',
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore(selectSubtotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const createOrder = useCreateOrder()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const totals = calculateTotals(subtotal)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (createOrder.isPending) return

    const found = validateCheckout(values)
    setErrors(found)

    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    createOrder.mutate(
      {
        customer: {
          email: values.email.trim(),
          fullName: values.fullName.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country,
        },
        items: items.map(({ id, quantity }) => ({ id, quantity })),
      },
      {
        onSuccess: (order) => {
          navigate(`/order-confirmation/${order.id}`, { replace: true })
          clearCart()
        },
      },
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 px-6 pb-20 pt-28">
        <div className="mx-auto max-w-lg rounded-xl border border-neutral-800 p-10 text-center">
          <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
          <p className="mt-2 text-sm text-neutral-400">Add a fragrance before checking out.</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
          >
            Browse fragrances
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="mb-8 inline-block text-sm text-neutral-400 hover:text-white"
        >
          ← Continue shopping
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={createOrder.isPending}
            className="space-y-10"
          >
            <fieldset className="space-y-4">
              <legend className="mb-4 text-lg font-semibold text-white">Contact</legend>
              <TextField
                id="email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
              />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-4 text-lg font-semibold text-white">Shipping address</legend>
              <TextField
                id="fullName"
                label="Full name"
                autoComplete="name"
                value={values.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <TextField
                id="address"
                label="Street address"
                autoComplete="street-address"
                value={values.address}
                onChange={handleChange}
                error={errors.address}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="city"
                  label="City"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={handleChange}
                  error={errors.city}
                />
                <TextField
                  id="postalCode"
                  label="Postal code"
                  autoComplete="postal-code"
                  value={values.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                />
              </div>
              <SelectField
                id="country"
                label="Country"
                autoComplete="country-name"
                options={COUNTRIES}
                placeholder="Select a country"
                value={values.country}
                onChange={handleChange}
                error={errors.country}
              />
            </fieldset>

            <p className="rounded-lg border border-neutral-800 p-4 text-xs text-neutral-400">
              This is a demo store. No payment is taken and no card details are collected.
            </p>

            {createOrder.isError && (
              <div
                role="alert"
                className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300"
              >
                {createOrder.error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createOrder.isPending
                ? 'Placing order…'
                : `Place order · ${formatMoney(totals.total)}`}
            </button>
          </form>

          <aside
            aria-label="Order summary"
            className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 lg:sticky lg:top-24"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Order summary</h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <ProductImage
                    src={item.image}
                    name={item.name}
                    fallbackTextClass="text-xl"
                    className="w-14 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">{item.name}</p>
                    <p className="text-xs text-neutral-400">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm text-white">{formatMoney(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-neutral-800 pt-4 text-sm">
              <div className="flex justify-between text-neutral-300">
                <dt>Subtotal</dt>
                <dd>{formatMoney(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-neutral-300">
                <dt>Shipping</dt>
                <dd>{totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between text-neutral-300">
                <dt>Estimated tax</dt>
                <dd>{formatMoney(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-3 text-base font-semibold text-white">
                <dt>Total</dt>
                <dd>{formatMoney(totals.total)}</dd>
              </div>
            </dl>

            {totals.shipping > 0 && (
              <p className="mt-4 text-xs text-neutral-400">
                Add {formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}