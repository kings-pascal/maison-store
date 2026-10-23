import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../../components/ui/Reveal'
import Skeleton from '../../components/ui/Skeleton'
import { useCategories } from '../products/api'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// Swap these ids for whichever bottle you like best in each category
const CATEGORY_IMAGES = {
  woody: '/products/1.webp',
  floral: '/products/9.webp',
  fresh: '/products/18.webp',
  oriental: '/products/17.webp',
}

const gridClass = 'grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6'

export default function CategoryTiles() {
  const sectionRef = useRef(null)
  const { data: categories, isPending, isError } = useCategories()
  const ready = Boolean(categories)

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return

    const gsapContext = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: layer.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => gsapContext.revert()
  }, [ready])

  if (isError) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="scent-heading"
      className="bg-neutral-950 px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Collections</p>
          <h2 id="scent-heading" className="mt-2 text-3xl font-bold text-white">
            Shop by scent
          </h2>
        </Reveal>

        {isPending ? (
          <ul className={gridClass} aria-busy="true" aria-label="Loading collections">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <Skeleton className="aspect-[3/4] rounded-xl" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className={gridClass}>
            {categories.map((category, index) => (
              <Reveal as="li" key={category.id} delay={index * 0.08}>
                <Link
                  to={`/products?category=${category.id}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <div data-parallax className="absolute inset-x-0 -top-[10%] h-[120%]">
                    <img
                      src={CATEGORY_IMAGES[category.id]}
                      alt=""
                      loading="lazy" width="800" height="1000" decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    />
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{category.name}</h3>
                    <p className="mt-1 text-xs text-neutral-300 sm:text-sm">{category.tagline}</p>
                    <span className="mt-3 inline-block text-xs text-white transition-transform duration-300 motion-safe:group-hover:translate-x-1 sm:text-sm">
                      Explore →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}