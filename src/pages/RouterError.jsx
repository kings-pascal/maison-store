import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()

  const isResponse = isRouteErrorResponse(error)
  const title = isResponse && error.status === 404 ? 'Page not found' : 'Something went wrong'
  const detail = isResponse ? `${error.status} ${error.statusText}` : error?.message

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-6 pb-20 pt-28 text-center"
    >
      <p className="text-sm uppercase tracking-widest text-neutral-400">Unexpected error</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        Sorry, this page ran into a problem. You can reload it, or head back home.
      </p>

      {import.meta.env.DEV && detail && (
        <pre className="mt-6 max-w-xl overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-left text-xs text-red-300">
          {detail}
        </pre>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black hover:bg-neutral-200"
        >
          Reload page
        </button>
        <a
          href="/"
          className="rounded-full border border-neutral-600 px-6 py-2 text-sm text-white hover:border-white"
        >
          Back to home
        </a>
      </div>
    </div>
  )
}