const NOTES = [
  'Rose',
  'Cedar',
  'Iris',
  'Amber',
  'Jasmine',
  'Oud',
  'Neroli',
  'Vetiver',
  'Orchid',
  'Saffron',
  'Peony',
  'Vanilla',
]

export default function ScentMarquee({ reverse = false }) {
  return (
    <div aria-hidden="true" className="overflow-hidden">
      <div
        className={`marquee-track ${reverse ? 'marquee-track--reverse' : ''}`}
        style={{ animationDuration: reverse ? '80s' : '65s' }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {NOTES.map((note) => (
              <li key={note} className="flex items-center">
                <span className="text-outline px-5 text-4xl font-bold uppercase leading-none sm:text-6xl">
                  {note}
                </span>
                <span className="text-xl text-white/25">•</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}