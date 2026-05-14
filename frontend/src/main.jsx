import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

import router from './routes/router.jsx'
import './index.css'
import store from './store/store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID} >

        <RouterProvider router={router} />

      </GoogleOAuthProvider>

    </Provider>
  </StrictMode>,
)
