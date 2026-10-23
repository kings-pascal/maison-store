import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Skeleton from '../components/ui/Skeleton'
import { useOrder } from '../features/checkout/api'
import { formatMoney } from '../lib/formatPrice'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const { data: order, isPending, isError, error, refetch } = useOrder(orderId)
  const headingRef = useRef(null)

  useEffect(() => {
    if (order) headingRef.current?.focus({ preventScroll: true })
  }, [order])

  let content

  if (isPending) {
    content = (
      <div role="status" className="mx-auto max-w-2xl">
        <span className="sr-only">Loading your order…</span>
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-9 w-2/3 rounded" />
        <Skeleton className="mx-auto mt-3 h-4 w-1/2 rounded" />
        <Skeleton className="mt-10 h-64 w-full rounded-xl" />
      </div>
    )
  } else if (isError && error.status === 404) {
    content = (
      <div className="py-20 text-center">
        <p className="text-sm uppercase tracking-widest text-neutral-400">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Order not found</h1>
        <p className="mt-2 text-neutral-400">We couldn't find an order with that number.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2 text-sm font-medium text-black"
        >
          Browse fragrances
        </Link>
      </div>
    )
  } else if (isError) {
    content = (
      <div role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-8 text-center">
        <p className="text-lg font-medium text-white">We couldn't load your order.</p>
        <p className="mt-1 text-sm text-red-300">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
        >
          Try again
        </button>
      </div>
    )
  } else {
    const firstName = order.customer.fullName.split(' ')[0]
    const placedOn = new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })

    content = (
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <svg
            viewBox="0 0 52 52"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="mx-auto h-16 w-16 text-emerald-400"
            aria-hidden="true"
          >
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              d="M15 27l8 8 14-16"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-6 text-3xl font-bold text-white focus:outline-none"
          >
            Thank you, {firstName}
          </h1>
          <p className="mt-2 text-neutral-400">
            Order <span className="font-mono text-white">{order.id}</span> is confirmed.
          </p>
        </div>

        <div className="mt-10 space-y-8 rounded-xl border border-neutral-800 bg-neutral-950 p-5 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-neutral-400">Shipping to</h2>
              <address className="mt-2 text-sm not-italic leading-relaxed text-neutral-200">
                {order.customer.fullName}
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.postalCode}
                <br />
                {order.customer.country}
              </address>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-wider text-neutral-400">Order details</h2>
              <p className="mt-2 text-sm text-neutral-200">Placed on {placedOn}</p>
              <p className="text-sm text-neutral-400">{order.customer.email}</p>
            </div>
          </div>

          <ul className="space-y-4 border-t border-neutral-800 pt-6">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate text-white">
                  {item.name} <span className="text-neutral-400">× {item.quantity}</span>
                </span>
                <span className="text-white">{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-neutral-800 pt-4 text-sm">
            <div className="flex justify-between text-neutral-300">
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-neutral-300">
              <dt>Shipping</dt>
              <dd>{order.shipping === 0 ? 'Free' : formatMoney(order.shipping)}</dd>
            </div>
            <div className="flex justify-between text-neutral-300">
              <dt>Tax</dt>
              <dd>{formatMoney(order.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-3 text-base font-semibold text-white">
              <dt>Total</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-block rounded-full bg-white px-7 py-3 text-sm font-medium text-black hover:bg-neutral-200"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">{content}</div>
    </div>
  )
}