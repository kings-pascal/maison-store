import { Link } from 'react-router-dom'
import ScrollScrubHero from '../animations/gsap/ScrollScrubHero'
import StatementSection from '../features/home/StatementSection'
import CategoryTiles from '../features/home/CategoryTiles'
import ProductGrid from '../features/products/ProductGrid'
import Reveal from '../components/ui/Reveal'
import { useProducts } from '../features/products/api'

export default function Home() {
  const query = useProducts({ featured: true, sort: 'rating', limit: 4 })

  return (
    <>
      <ScrollScrubHero />
      <StatementSection />
      <CategoryTiles />
      <section className="bg-neutral-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">Featured</h2>
            <Link
              to="/products"
              className="text-sm text-neutral-300 underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </Reveal>
          <ProductGrid query={query} skeletonCount={4} />
        </div>
      </section>
    </>
  )
}