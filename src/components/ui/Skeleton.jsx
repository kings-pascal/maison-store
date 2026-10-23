export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-neutral-800 motion-safe:animate-pulse ${className}`}
    />
  )
}