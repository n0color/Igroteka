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

const Router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/catalog',
    element: <Catalog />
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
