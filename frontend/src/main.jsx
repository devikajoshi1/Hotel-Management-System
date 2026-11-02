import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Logins saved before tickets existed have no token, so ask those users to log in again
const savedUser = JSON.parse(localStorage.getItem('user'))
if (savedUser && !savedUser.token) {
  localStorage.removeItem('user')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
