import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  BrowserRouter, 
  createBrowserRouter, 
  RouterProvider, 
  Route, 
} from 'react-router-dom';

import App from './main.jsx'
import Catalog from './Pages/Catalog.jsx';
import Store from './Pages/store.jsx';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/catalog',
    element: <Catalog />
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
