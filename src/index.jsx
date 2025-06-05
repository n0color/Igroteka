import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  BrowserRouter, 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
} from 'react-router-dom';

import App from './Routes/main.jsx'
import Catalog from './Routes/Catalog.jsx';
import Product from './Routes/Product.jsx';
import ErrorPage404 from './Routes/ErrorPage404.jsx';
import Store from './Routes/Store.jsx';
const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage404 />,
  },
  {
    path: '/catalog',
    element: <Catalog />
  },
  {
    path: '/catalog/:productid',
    element: <Product />
  },
  {
    path: '/store',
    element: <Store />
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
