import { Fragment, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScentMarquee from './ScentMarquee'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// Placeholder copy: rewrite it in your own words and only keep claims that are true
const STATEMENT =
  'We make fragrance slowly. Small batches, rare woods, amber and iris. Nothing rushed, only scents worth keeping.'

export default function StatementSection() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const words = STATEMENT.split(' ')

  useEffect(() => {
    if (prefersReducedMotion()) return

    const gsapContext = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
          },
        },
      )
    }, sectionRef)

    return () => gsapContext.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-neutral-950 py-14 sm:py-16">
      <ScentMarquee />
      <div className="my-8 px-6 sm:my-10">
        <div className="mx-auto max-w-6xl">
          <p
            ref={textRef}
            className="max-w-4xl text-2xl font-semibold leading-snug text-white sm:text-4xl"
          >
            {words.map((word, index) => (
              <Fragment key={index}>
                <span data-word className="inline-block">
                  {word}
                </span>{' '}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      <ScentMarquee reverse />
    </section>
  )
}