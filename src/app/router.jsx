import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../components/layout/RootLayout'
import RouteError from '../pages/RouterError'

const Home = lazy(() => import('../pages/Home'))
const ProductList = lazy(() => import('../pages/ProductList'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Wishlist = lazy(() => import('../pages/wishlist'))
const Checkout = lazy(() => import('../pages/Checkout'))
const OrderConfirmation = lazy(() => import('../pages/OrderConfimation'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Home /> },
          { path: 'products', element: <ProductList />, handle: { title: 'All fragrances' } },
          { path: 'products/:id', element: <ProductDetail />, handle: { title: 'Fragrance' } },
          { path: 'wishlist', element: <Wishlist />, handle: { title: 'Wishlist' } },
          { path: 'checkout', element: <Checkout />, handle: { title: 'Checkout' } },
          {
            path: 'order-confirmation/:orderId',
            element: <OrderConfirmation />,
            handle: { title: 'Order confirmed' },
          },
          { path: '*', element: <NotFound />, handle: { title: 'Page not found' } },
        ],
      },
    ],
  },
])