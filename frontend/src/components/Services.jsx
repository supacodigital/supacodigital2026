import { useState, useEffect, useRef } from 'react'
import { Icon } from '../icons'
import ProjectConfigurator from './ProjectConfigurator'
import { useReveal } from '../useReveal'


function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = e => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return mobile
}

const plans = [
  {
    id: 'starter',
    name: 'SITE VITRINE',
    contactValue: 'Site Vitrine',
    color: 'var(--cyan)',
    glow: 'rgba(0,229,255,.15)',
    popular: false,
    surMesure: true,
    cta: 'Prendre RDV gratuit',
    badge: 'Sur devis après RDV',
    sections: [
      {
        label: 'CE QUI EST INCLUS',
        features: [
          { text: "Jusqu'à 5 pages sur mesure", included: true },
          { text: 'Design responsive mobile & desktop', included: true },
          { text: 'Formulaire de contact', included: true },
          { text: 'Livraison en ~7 jours', included: true },
          { text: 'SEO de base', included: true },
        ],
      },
    ],
  },
  {
    id: 'pro',
    name: 'SITE PRO',
    contactValue: 'Site Pro',
    color: '#1a6bff',
    glow: 'rgba(26,107,255,.2)',
    popular: true,
    surMesure: true,
    cta: 'Prendre RDV gratuit',
    badge: 'Sur devis après RDV',
    sections: [
      {
        label: 'CE QUI EST INCLUS',
        features: [
          { text: "Jusqu'à 10 pages sur mesure", included: true },
          { text: 'Design responsive mobile & desktop', included: true },
          { text: 'SEO on-page optimisé', included: true },
          { text: 'Blog & galerie de réalisations', included: true },
          { text: 'Formation à la prise en main', included: true },
        ],
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-COMMERCE',
    contactValue: 'E-Commerce',
    color: '#a855f7',
    glow: 'rgba(168,85,247,.15)',
    popular: false,
    noCommission: true,
    cta: 'Prendre RDV gratuit',
    badge: 'Sur devis après RDV',
    sections: [
      {
        label: 'CE QUI EST INCLUS',
        features: [
          { text: 'Produits illimités — 0% de commission', included: true },
          { text: 'Paiement en ligne intégré', included: true },
          { text: 'Dashboard admin & gestion stocks', included: true },
          { text: 'SEO on-page + Blog', included: true },
          { text: "Intégration produits (jusqu'à 30 réf.)", included: true },
          { text: 'Formation à la prise en main', included: true },
        ],
      },
    ],
  },
  {
    id: 'webapp',
    name: 'APP RESTAURANT',
    contactValue: 'App Restaurant',
    color: '#22c55e',
    glow: 'rgba(34,197,94,.15)',
    popular: false,
    noCommissionResto: true,
    cta: 'Prendre RDV gratuit',
    badge: 'Sur devis après RDV',
    sections: [
      {
        label: 'CE QUI EST INCLUS',
        features: [
          { text: 'Commande à emporter & livraison', included: true },
          { text: 'Paiement en ligne intégré', included: true },
          { text: 'Dashboard gérant (plats, commandes)', included: true },
          { text: 'SEO optimisé', included: true },
          { text: 'Formation à la prise en main', included: true },
        ],
      },
    ],
  },
]

function PricingCard({ plan, showArrow, onOpenCalendly, active }) {
  return (
    <div
      className={`pricing-card${plan.popular ? ' pricing-card--popular' : ''}${active ? ' pricing-card--active' : ''}`}
      style={{ '--plan-color': plan.color, '--plan-glow': plan.glow }}
    >
      {plan.popular && (
        <div className="pricing-badge">Le plus populaire</div>
      )}
      {showArrow && (
        <span className="pricing-swipe-arrow-fixed">→</span>
      )}

      <div className="pricing-card-body">
        <div className="pricing-header">
          <div className="pricing-name">{plan.name}</div>
        </div>

        {plan.surMesure && (
          <div className="pricing-sur-mesure">
            <span>100% sur mesure — zéro template</span>
            <span className="pricing-sur-mesure-sub">Identité unique, rien que pour vous</span>
          </div>
        )}
        {plan.noCommissionResto && (
          <div className="pricing-no-commission-resto">
            <span>0% de commission sur vos commandes</span>
            <span className="pricing-no-commission-vs">vs Uber Eats jusqu'à 30%</span>
          </div>
        )}
        {plan.noCommission && (
          <div className="pricing-no-commission">
            <span>0% de commission sur vos ventes</span>
            <span className="pricing-no-commission-vs">vs Shopify jusqu'à 2%</span>
          </div>
        )}

        <div className="pricing-divider" />

        {plan.sections.map(section => (
          <div key={section.label} className="pricing-section">
            <div className="pricing-section-label">{section.label}</div>
            <ul className="pricing-features">
              {section.features.map(f => (
                <li key={f.text} className={`pricing-feature${f.included ? '' : ' pricing-feature--off'}`}>
                  {f.included ? <Icon.Check /> : <Icon.XMark />}
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pricing-card-footer">
        <button className="pricing-cta" onClick={() => onOpenCalendly()}>
          {plan.cta}
          <span className="pricing-cta-arrow"><Icon.Arrow /></span>
        </button>
      </div>
    </div>
  )
}


export default function Services({ onOpenCalendly }){
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()
  const touchStartX = useRef(null)
  const headerRef = useReveal(0.2)
  const gridRef   = useReveal(0.05)

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) setActiveIndex(i => Math.min(i + 1, plans.length - 1))
    else        setActiveIndex(i => Math.max(i - 1, 0))
  }

  return (
    <section className="section" id="services">
      <div className="reveal-up" ref={headerRef}>
        <div className="section-label">Offres</div>
        <h2 className="section-title">Choisissez votre <em>offre</em></h2>
        <div className="services-availability">
          <span className="services-avail-dot" aria-hidden="true" />
          <span>Disponible — <strong>2 créneaux restants</strong> pour démarrer en mai</span>
        </div>
      </div>

      <div
        className="pricing-grid reveal-stagger"
        ref={gridRef}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        {plans.map((plan, i) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            showArrow={false}
            onOpenCalendly={onOpenCalendly}
            active={!isMobile || activeIndex === i}
          />
        ))}
      </div>

{isMobile && (
        <div className="pricing-slider-dots">
          {plans.map((_, i) => (
            <button
              key={i}
              className={`pricing-slider-dot${activeIndex === i ? ' pricing-slider-dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Voir l'offre ${plans[i].name}`}
            />
          ))}
        </div>
      )}

      <ProjectConfigurator onOpenCalendly={onOpenCalendly} />

      <div className="custom-card">
        <div className="custom-card-glow" />
        <p className="custom-card-desc">
          Vous avez un projet hors catalogue ? Marketplace, SaaS, outil métier… On développe votre application sur mesure.
        </p>
        <button className="custom-card-cta" onClick={() => onOpenCalendly()}>
          Discutons de votre projet
          <span className="custom-card-cta-arrow"><Icon.Arrow /></span>
        </button>
      </div>

    </section>
  )
}
