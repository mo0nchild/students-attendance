import { createRoot } from 'react-dom/client'
import '@core/index.css'
import App from '@core/App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
