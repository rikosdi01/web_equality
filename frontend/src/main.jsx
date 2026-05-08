import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { AccessTokenProvider } from './context/AccessTokenContext.jsx'

createRoot(document.getElementById('root')).render(
  <AccessTokenProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </AccessTokenProvider>
)
