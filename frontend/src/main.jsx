import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import router from './routes/router.jsx'
import './index.css'
import store from './store/store.js'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <QueryClientProvider client={queryClient}>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID} >

          <RouterProvider router={router} />

          <ReactQueryDevtools />

        </GoogleOAuthProvider>

      </QueryClientProvider>

    </Provider>
  </StrictMode>,
)
