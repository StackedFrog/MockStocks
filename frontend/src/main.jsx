import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './auth_context.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)


  // <StrictMode>
  // <AuthProvider>
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </AuthProvider>
  // </StrictMode>,
