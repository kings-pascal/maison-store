import { Suspense, useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from '../../features/cart/CartDrawer'

const SITE_NAME = 'MAISON'

function PageFallback() {
  return (
    <div role="status" className="min-h-screen bg-neutral-900">
      <span className="sr-only">Loading page…</span>
    </div>
  )
}

export default function RootLayout() {
  const { pathname } = useLocation()
  const matches = useMatches()

  const routeTitle = [...matches].reverse().find((match) => match.handle?.title)?.handle.title
  const title = routeTitle ? `${routeTitle} | ${SITE_NAME}` : `${SITE_NAME} | Small-batch fragrance`

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div className="min-h-screen bg-black text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<PageFallback />}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration />
    </div>
  )
}