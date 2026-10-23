export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-black px-6 py-10">
      <p className="mx-auto max-w-6xl text-sm text-neutral-400">
        © {new Date().getFullYear()} MAISON. A portfolio project.
      </p>
    </footer>
  )
}