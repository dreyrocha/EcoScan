import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContex.jsx';
import { EnterpriseAuthProvider } from './context/EnterpriseAuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EnterpriseAuthProvider>
        <App />
      </EnterpriseAuthProvider>
    </AuthProvider>
  </StrictMode>,
)