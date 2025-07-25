import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserContext from './Context/user_context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
      <App/>
    </UserContext>
  </StrictMode>
)
