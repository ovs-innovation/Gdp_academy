import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { RootRouter } from './router/RootRouter.tsx'
import './styles/theme.css'
import './styles/responsive.css'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootRouter>
      <App />
    </RootRouter>
  </StrictMode>,
)
