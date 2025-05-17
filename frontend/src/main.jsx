import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'

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
  //   </BrviewowserRouter>
  // </AuthProvider>
  // </StrictMode>,
