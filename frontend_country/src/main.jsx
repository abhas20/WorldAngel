import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './auth/context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"/>
    <App />
    </AuthProvider>
  </StrictMode>,
)
