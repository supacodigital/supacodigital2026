import { useState, useEffect } from 'react'
import { Icon } from '../icons'
import { trackEvent } from '../useAnalytics'

export default function StickyBar({ onOpenCalendly }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const hero = document.getElementById('accueil')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [dismissed])

  useEffect(() => {
    document.body.classList.toggle('has-sticky-bar', visible && !dismissed)
    return () => document.body.classList.remove('has-sticky-bar')
  }, [visible, dismissed])

  if (dismissed || !visible) return null

  return (
    <div className="sticky-bar" role="complementary" aria-label="Actions rapides">
      <div className="sticky-bar-inner">
        <div className="sticky-bar-text">
          <span className="sticky-bar-dot" aria-hidden="true" />
          <span className="sticky-bar-label">Disponible cette semaine</span>
        </div>

        <div className="sticky-bar-actions">
          <button
            className="sticky-bar-ghost"
            onClick={() => {
              trackEvent('sticky_bar_calendly')
              onOpenCalendly()
            }}
          >
            <Icon.Cal />
            <span>Appel gratuit 30 min</span>
          </button>
          <a
            href="#contact"
            className="sticky-bar-cta"
            onClick={() => trackEvent('sticky_bar_contact')}
          >
            <span>Démarrer mon projet</span>
            <Icon.Arrow />
          </a>
        </div>

        <button
          className="sticky-bar-close"
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
        >
          <Icon.Close />
        </button>
      </div>
    </div>
  )
}
