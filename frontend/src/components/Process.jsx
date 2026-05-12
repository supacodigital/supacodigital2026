import LightBg from './LightBg'
import { useReveal } from '../useReveal'

const STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Appel Découverte',
    delay: '30 min',
    delayLabel: 'Gratuit',
    desc: 'On échange sur vos objectifs, votre cible et votre vision. Je cerne exactement ce dont vous avez besoin.',
    outcome: 'Cahier des charges',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Devis & Validation',
    delay: '24h',
    delayLabel: 'Délai',
    desc: 'Vous recevez un devis personnalisé sous 24h. On valide ensemble le périmètre avant de démarrer.',
    outcome: 'Devis signé',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Développement',
    delay: '7–21j',
    delayLabel: 'Durée',
    desc: 'Je code votre site ou app de A à Z. Vous suivez l\'avancement en temps réel et validez chaque étape.',
    outcome: 'Site en staging',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    ),
    title: 'Mise en ligne',
    delay: 'J+1',
    delayLabel: 'Livraison',
    desc: 'Déploiement, formation sur l\'outil et support inclus. Le site est à vous — code source et tout.',
    outcome: 'Site live ✓',
  },
]

export default function Process() {
  const headerRef = useReveal(0.2)
  const stepsRef  = useReveal(0.1)

  return (
    <section className="section process" id="processus">
      <LightBg variant="c" />

      <div className="process-header reveal-up" ref={headerRef}>
        <div className="section-label">Méthode</div>
        <h2 className="section-title">De l'idée à la <em>mise en ligne</em></h2>
        <p className="process-subtitle">Un processus clair, sans surprise — de l'appel découverte à la livraison.</p>
      </div>

      <div className="process-timeline reveal-stagger" ref={stepsRef}>
        {STEPS.map((s, i) => (
          <div key={s.num} className="process-step">
            {/* Connecteur entre les étapes */}
            {i < STEPS.length - 1 && (
              <div className="process-connector" aria-hidden="true">
                <div className="process-connector-line" />
                <svg className="process-connector-arrow" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0l8 8-8 8V0z" />
                </svg>
              </div>
            )}

            <div className="process-card">
              {/* Badge délai */}
              <div className="process-badge">
                <span className="process-badge-val">{s.delay}</span>
                <span className="process-badge-lbl">{s.delayLabel}</span>
              </div>

              {/* Numéro + icône */}
              <div className="process-icon-wrap">
                <div className="process-icon">{s.icon}</div>
                <span className="process-num">{s.num}</span>
              </div>

              <h3 className="process-step-title">{s.title}</h3>
              <p className="process-step-desc">{s.desc}</p>

              {/* Résultat */}
              <div className="process-outcome">
                <span className="process-outcome-dot" aria-hidden="true" />
                {s.outcome}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Garantie bas de section */}
      <div className="process-guarantee reveal-up" ref={useReveal(0.3)}>
        <span className="process-guarantee-icon">🔒</span>
        <span>Devis gratuit · Sans engagement · Code source livré</span>
      </div>
    </section>
  )
}
