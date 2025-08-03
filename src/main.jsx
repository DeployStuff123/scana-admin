import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/index.js'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme.js'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from './context/UserProvider.jsx'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="938615117196-4mn1el0j4cue65gs8shraopfgr4ti8sm.apps.googleusercontent.com">
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <UserProvider>
                <CssBaseline />
                <Toaster position="bottom-center" />
                <App />
              </UserProvider>
            </AuthProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
