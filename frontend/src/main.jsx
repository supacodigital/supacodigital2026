import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

// Désactive la restauration de scroll du navigateur : au rechargement on
// repart toujours en haut. Évite que les animations scroll-driven (hero/volet)
// démarrent à mi-parcours et provoquent un flash de la section About.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

// --app-vh : hauteur visible réelle (= window.innerHeight), source unique pour
// CSS et GSAP. Sur mobile, 100vh (CSS) inclut la barre d'URL alors que
// innerHeight non → l'écart cassait l'effet volet (Services chevauchait le
// hero). On fixe la valeur au chargement et seulement sur changement RÉEL de
// taille (orientation), pas à chaque scroll (où la barre d'URL fait varier
// innerHeight et ferait sauter le volet).
function setAppVh() {
  document.documentElement.style.setProperty('--app-vh', `${window.innerHeight}px`)
}
setAppVh()
let lastVw = window.innerWidth
window.addEventListener('resize', () => {
  // Ne recalcule que si la LARGEUR change (vraie rotation / resize desktop),
  // pas sur les variations de hauteur dues à la barre d'URL mobile.
  if (window.innerWidth !== lastVw) {
    lastVw = window.innerWidth
    setAppVh()
  }
})
window.addEventListener('orientationchange', setAppVh)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
