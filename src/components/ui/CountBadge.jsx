import { motion } from 'framer-motion'

export default function CountBadge({ count }) {
  if (count <= 0) return null

  return (
    <motion.span
      key={count}
      initial={{ scale: 1.5 }}
      animate={{ scale: 1 }}
      aria-hidden="true"
      className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-black"
    >
      {count}
    </motion.span>
  )
}