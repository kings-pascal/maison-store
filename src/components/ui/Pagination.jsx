export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const base = 'rounded-full border px-4 py-2 text-sm transition-colors'
  const idle = 'border-neutral-700 text-neutral-300 hover:border-neutral-400'

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Previous
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? 'page' : undefined}
          aria-label={`Page ${n}`}
          onClick={() => onPageChange(n)}
          className={`${base} ${n === page ? 'border-white bg-white text-black' : idle}`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${base} ${idle} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
      </button>
    </nav>
  )
}