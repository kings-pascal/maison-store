import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-neutral-400">404</p>
      <h1 className="mt-2 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-neutral-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-full bg-white px-6 py-2 text-sm font-medium text-black">
        Back to home
      </Link>
    </div>
  )
}