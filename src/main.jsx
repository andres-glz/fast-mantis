import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import './index.css'
import { App } from './App.jsx'
import { Footer } from './components/footer/Footer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <App />
      <Footer />
    </Provider>
  </StrictMode>,
)
