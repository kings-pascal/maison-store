import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import Providers from './app/providers.jsx'
import { setApiReady } from './lib/apiClient'

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'false') return

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
    quiet: import.meta.env.PROD,
  })
}

// Start the mock API in the background. API calls wait for it; the page does not.
setApiReady(
  enableMocking().catch((error) => {
    console.error('Could not start the mock API', error)
  }),
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)    