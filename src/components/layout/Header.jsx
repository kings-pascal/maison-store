import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import CountBadge from '../ui/CountBadge'
import HeartIcon from '../ui/HeartIcon'
import { selectTotalItems, useCartStore } from '../../features/cart/cartStore'
import { selectWishlistCount, useWishlistStore } from '../../features/wishlist/wishlistStore'

// Matches the h-16 on the bar below (16 x 4px = 64px)
const HEADER_HEIGHT = 64

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`

const iconClass =
  'relative text-neutral-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

export default function Header() {
  const { pathname } = useLocation()
  const totalItems = useCartStore(selectTotalItems)
  const openCart = useCartStore((state) => state.openCart)
  const wishlistCount = useWishlistStore(selectWishlistCount)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('[data-hero]')
      if (hero) {
        // Home page: stay transparent until the hero has scrolled out of view
        setSolid(hero.getBoundingClientRect().bottom <= HEADER_HEIGHT)
      } else {
        setSolid(window.scrollY > 8)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b border-white/10 bg-black/75 backdrop-blur-md motion-safe:transition-opacity motion-safe:duration-300 ${
          solid ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-base font-semibold tracking-[0.25em] text-white sm:text-lg sm:tracking-[0.3em]"
        >
          MAISON
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <nav aria-label="Main">
            <ul className="flex items-center gap-5 sm:gap-8">
              <li>
                <NavLink to="/" end className={linkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className={linkClass}>
                  Shop
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
              className={iconClass}
            >
              <HeartIcon className="h-6 w-6" />
              <CountBadge count={wishlistCount} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
              className={iconClass}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M6 7h12l1 13H5L6 7Z" strokeLinejoin="round" />
                <path d="M9 7V6a3 3 0 0 1 6 0v1" strokeLinecap="round" />
              </svg>
              <CountBadge count={totalItems} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}