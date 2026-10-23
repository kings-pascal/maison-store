import { useState } from 'react'

export default function ProductImage({
  src,
  name,
  priority = false,
  className = '',
  fallbackTextClass = 'text-6xl',
  children,
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-800 ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={name}
          className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#3f3f46,#171717)]"
        >
          <span className={`font-light text-neutral-400 ${fallbackTextClass}`} aria-hidden="true">
            {name.charAt(0)}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          width="800"
          height="1000"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      )}
      {children}
    </div>
  )
}