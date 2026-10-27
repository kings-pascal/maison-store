# MAISON: an animated fragrance store

A small-batch fragrance e-commerce frontend built with React. The goal was to show real frontend engineering, not only a good-looking page: scroll-driven animation, cached data fetching, URL-driven filters, a persistent cart, accessible forms, resilient loading and error states, and a production deployment.

**Live demo:** https://maison-store-chi.vercel.app/

## Highlights

- **Scroll-scrubbed hero.** A 120-frame image sequence is drawn on a `<canvas>` and driven by GSAP ScrollTrigger, so scrolling plays the bottle's rotation forward and backward like a video timeline. Five text chapters crossfade on a scrubbed GSAP timeline. The first frame shows immediately and the remaining frames load in the background.
- **Scroll motion across the site.** Staggered card reveals, parallax category tiles, a word-by-word scrolling statement, a drifting scent-note marquee, a light ring that sweeps each product card as it enters, and a fade between routes, built with GSAP and Framer Motion.
- **Shop.** Debounced search, category filter, sort and pagination. All of it lives in the URL, so views can be shared, refreshed and navigated with the Back button.
- **Product pages.** Dynamic routes, related products, and distinct loading, not-found and error states.
- **Cart and wishlist.** Zustand stores persisted to `localStorage`, with an accessible slide-in cart drawer.
- **Checkout.** Validated form, order placed through the API, and an order confirmation page that survives a refresh.
- **Every data view** has skeleton, error and empty states.
- **Responsive and accessible.** Mobile-first layout, keyboard support, and a reduced-motion mode.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19, Vite |
| Routing | React Router (data router, lazy-loaded pages) |
| Server state | TanStack Query |
| Client state | Zustand with `persist` |
| Styling | Tailwind CSS v4 |
| Animation | GSAP + ScrollTrigger for scroll-linked scenes, Framer Motion for UI transitions |
| API | Mock Service Worker (MSW) simulating a REST backend in the browser |
| Hosting | Vercel |

## How the data works

There is no server. MSW registers a service worker that intercepts `fetch` requests in the browser and answers them like a real REST API, with network delay and error cases. The app calls normal `/api/...` URLs, so the UI code does not know the data is mocked.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/categories` | Category list |
| `GET /api/products` | Query params: `search`, `category`, `sort` (`newest`, `rating`, `price-asc`, `price-desc`), `page`, `limit`, `featured`, `exclude` |
| `GET /api/products/:id` | One product, `404` if missing |
| `POST /api/orders` | Validates items and customer, prices the order, stores it |
| `GET /api/orders/:id` | One order, `404` if missing |

To use a real backend, set `VITE_USE_MOCKS=false` and `VITE_API_URL` to its address. The mock code is then never downloaded.

## Engineering decisions

- **Filter state lives in the URL, not in `useState`.** Refresh, sharing and the Back button all work, and it behaves like a real store.
- **The server owns prices.** The browser sends only product ids and quantities. The order handler looks up the real prices and calculates shipping and tax, because trusting prices from the browser would let anyone edit their cart.
- **TanStack Query keys include the params.** Each filter combination is cached separately, and `keepPreviousData` keeps the old results on screen (dimmed) while the next page loads, so the grid does not flash.
- **One small API client** turns HTTP errors into real errors, so `404` and `500` can be handled differently, and retries skip 404s.
- **The page does not wait for the mock API.** The app paints immediately, and only API calls wait for the mock to be ready, which keeps the first paint fast.
- **Selectors keep re-renders small.** Components subscribe to only the slice of the store they need.
- **Motion respects the user's system setting.** With reduced motion on, movement is replaced by simple fades and the scroll-linked effects are skipped.
- **Two transforms never share an element.** GSAP parallax moves a wrapper and the CSS hover zoom scales the image inside it.

## Accessibility

- Skip link, semantic landmarks, and a unique document title per route
- Cart drawer: focus moves in, is trapped while open, `Esc` closes it, and focus returns to the opener
- Visible focus rings; toggles use `aria-pressed`; live regions announce result counts
- Labelled form fields with errors tied to their inputs, and focus sent to the first invalid field
- Text colors chosen to meet WCAG AA contrast, meaningful `alt` text, and decorative images hidden from screen readers
- Reduced-motion support in both GSAP and Framer Motion

## Performance

- Route-level code splitting for every page except Home, which ships with the main bundle because it is the landing page
- Hero frames in WebP, loaded progressively: the first frame, then every tenth, then the rest
- Lazy-loaded images with explicit dimensions, WebP product photos, and cache headers on static assets
- Debounced search, and cached queries so revisits do not refetch
- Canvas sized for the device pixel ratio so it stays sharp

### Lighthouse (Home page)

Measured with Chrome DevTools Lighthouse.

| Category | Mobile | Desktop |
| --- | --- | --- |
| Performance | 68 | 63 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 92 | 92 |

The Home page scores lowest on performance because it loads a 120-frame animation. That is a deliberate trade-off: Lighthouse measures the first load and does not scroll, so it cannot see what those frames provide.

## Getting started

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build at http://localhost:4173 |
| `npm run lint` | Runs ESLint |

Copy `.env.example` to `.env` to change settings. Variables starting with `VITE_` are bundled into the public JavaScript, so never put secrets in them.

## Project structure

```text
src/
  app/              App shell, providers, router
  pages/            Route pages: Home, ProductList, ProductDetail, Wishlist,
                    Checkout, OrderConfirmation, NotFound, RouteError
  features/
    products/       Queries, product card and grid, skeletons, filters, related products
    cart/           Persisted store, drawer, add-to-cart button
    wishlist/       Persisted store, wishlist button
    checkout/       Order mutation and query, form validation
    home/           Home-only sections: statement, scent marquee, category tiles
  components/
    layout/         Header, footer, root layout
    ui/             Reusable UI: Skeleton, ProductImage, Pagination, Field, Reveal, ...
  animations/gsap/  Scroll-scrubbed hero
  lib/              API client, query client, pricing, formatting, motion helper
  mocks/            MSW handlers and seed data
public/
  hero-sequence/    120 WebP frames for the hero
  products/         24 product images
```

## Deployment

Deployed on Vercel. `vercel.json` rewrites unknown URLs to `index.html` so client-side routes work on refresh, and sets cache headers for the hero frames and product images. Pushing to `main` redeploys automatically.

## Known limitations

- The backend is simulated. Products and orders live in the browser (service worker and `localStorage`), and no real payment is taken.
- The demo needs a browser that allows service workers. Firefox private windows do not.
- Orders are stored per browser, so another device will not see them.
- Pagination is used instead of infinite scroll.
- Brand copy is placeholder text.
- There are no automated tests yet.

## What I would do next

- Add unit and integration tests (Vitest and Testing Library) for the cart store, pricing and the checkout form
- Serve fewer, smaller hero frames on phones to improve mobile performance
- Replace the mock API with a real backend and move prices and orders server-side for good
- Add real payment through a provider, so card details never touch the app

## Credits

Product and hero imagery was generated with AI tools. All bottles are unbranded and no real brands are depicted.

## License

Personal portfolio project. All rights reserved unless a `LICENSE` file says otherwise.