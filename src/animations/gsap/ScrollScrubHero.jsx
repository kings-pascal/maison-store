import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 120
const COARSE_STEP = 10
const getFramePath = (index) =>
  `/hero-sequence/frame_${String(index).padStart(3, '0')}.webp`

// Load order: the first frame, then every 10th frame, then everything else.
// Wherever a visitor scrolls early on, a nearby frame is already available.
const LOAD_ORDER = (() => {
  const order = [0]
  for (let i = COARSE_STEP; i < FRAME_COUNT; i += COARSE_STEP) order.push(i)
  for (let i = 1; i < FRAME_COUNT; i++) {
    if (i % COARSE_STEP !== 0) order.push(i)
  }
  return order
})()

// Timing is measured in fractions of the whole hero scroll: 0 = top, 1 = bottom
const FADE = 0.08 // how long a chapter takes to fade in or out
const HOLD = 0.08 // how long it stays fully visible
const INTRO_OUT = 0.13 // when the opening text starts to leave
const CTA_AT = 0.77 // when the closing text starts to arrive

// Placeholder copy: rewrite it in your own words and only keep claims that are true
const STORY = [
  {
    id: 'craft',
    at: 0.17,
    align: 'right',
    eyebrow: 'The craft',
    title: 'Slow by design',
    text: 'Every blend rests for weeks before it is bottled.',
  },
  {
    id: 'notes',
    at: 0.37,
    align: 'left',
    eyebrow: 'The notes',
    title: 'Wood, amber, iris',
    text: 'Three accords that linger long after you leave the room.',
  },
  {
    id: 'ritual',
    at: 0.57,
    align: 'right',
    eyebrow: 'The ritual',
    title: 'One spray is enough',
    text: 'Made to stay close to the skin and last through the evening.',
  },
]

const chapterBase =
  'pointer-events-none absolute inset-0 flex px-6 sm:px-12 [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]'

const buttonClass =
  'pointer-events-auto mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

function ScrollScrubHero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const renderRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // 1. Load the frames. The first one shows the hero at once; the rest arrive in the background.
  useEffect(() => {
    let cancelled = false
    let settledCount = 0
    const images = new Array(FRAME_COUNT)
    imagesRef.current = images

    const onSettled = (index) => {
      if (cancelled) return
      settledCount++
      setProgress(Math.floor((settledCount / FRAME_COUNT) * 20) * 5)
      if (index === 0) setReady(true)
      renderRef.current?.()
    }

    LOAD_ORDER.forEach((index) => {
      const img = new Image()
      img.onload = () => onSettled(index)
      img.onerror = () => onSettled(index)
      img.src = getFramePath(index + 1)
      images[index] = img
    })

    return () => {
      cancelled = true
    }
  }, [])

  // 2. Once the first frame is ready, connect scroll position to the frames and the text
  useEffect(() => {
    if (!ready) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const frame = { index: 0 }

    // The wanted frame, or the closest earlier one that has finished loading
    const findFrame = (wanted) => {
      for (let i = wanted; i >= 0; i--) {
        const img = imagesRef.current[i]
        if (img && img.complete && img.naturalWidth) return img
      }
      return null
    }

    const render = () => {
      const img = findFrame(Math.round(frame.index))
      if (!img) return
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.width, ch / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    renderRef.current = render

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.parentElement.clientWidth * dpr
      canvas.height = canvas.parentElement.clientHeight * dpr
      render()
    }

    resize()
    window.addEventListener('resize', resize)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const shift = reduceMotion ? 0 : 40

    const gsapContext = gsap.context(() => {
      // The spinning bottle
      gsap.to(frame, {
        index: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: render,
      })

      // The text: a timeline exactly 1 long, so positions read as "percent of the scroll"
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })

      tl.to('[data-chapter="intro"]', { autoAlpha: 0, y: -shift, duration: FADE }, INTRO_OUT)

      STORY.forEach((chapter) => {
        const target = `[data-chapter="${chapter.id}"]`
        tl.fromTo(
          target,
          { autoAlpha: 0, y: shift },
          { autoAlpha: 1, y: 0, duration: FADE },
          chapter.at,
        )
        tl.to(target, { autoAlpha: 0, y: -shift, duration: FADE }, chapter.at + FADE + HOLD)
      })

      tl.fromTo(
        '[data-chapter="cta"]',
        { autoAlpha: 0, y: shift },
        { autoAlpha: 1, y: 0, duration: 0.1 },
        CTA_AT,
      )
      tl.set({}, {}, 1)
    }, sectionRef)

    return () => {
      renderRef.current = null
      window.removeEventListener('resize', resize)
      gsapContext.revert()
    }
  }, [ready])

  return (
    <section ref={sectionRef} data-hero className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />

        <div data-chapter="intro" className={`${chapterBase} items-end pb-16 sm:pb-24`}>
          <div className="max-w-xs sm:max-w-md">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
              Dark, warm, unforgettable.
            </h1>
            <p className="mt-3 text-sm text-neutral-300 sm:text-base">
              Rare woods, amber and iris, blended in small batches.
            </p>
            <Link to="/products" className={buttonClass}>
              Shop the collection
            </Link>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-400">
              Scroll to explore
            </p>
          </div>
        </div>

        {STORY.map((chapter) => (
          <div
            key={chapter.id}
            data-chapter={chapter.id}
            className={`${chapterBase} invisible items-center ${
              chapter.align === 'right' ? 'justify-end text-right' : 'justify-start'
            }`}
          >
            <div className="max-w-[16rem] sm:max-w-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                {chapter.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{chapter.title}</h2>
              <p className="mt-3 text-sm text-neutral-300 sm:text-base">{chapter.text}</p>
            </div>
          </div>
        ))}

        <div
          data-chapter="cta"
          className={`${chapterBase} invisible items-end justify-center pb-16 text-center sm:pb-24`}
        >
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">Find your signature</h2>
            <Link to="/products" className={buttonClass}>
              Shop all fragrances
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px bg-white/10 transition-opacity duration-700 ${
            progress >= 100 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className="h-full bg-white/70 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}

export default ScrollScrubHero