import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  const timerRef = useRef(null)

  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleChange = (event) => {
    const next = event.target.value
    setText(next)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(next.trim()), 400)
  }

  return (
    <div role="search">
      <label htmlFor="product-search" className="sr-only">
        Search fragrances
      </label>
      <input
        id="product-search"
        type="search"
        value={text}
        onChange={handleChange}
        placeholder="Search by name or note…"
        className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-white placeholder:text-neutral-400 focus:border-white focus:outline-none"
      />
    </div>
  )
}