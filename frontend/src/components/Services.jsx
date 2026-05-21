import { Icon } from '../icons'
import { useReveal } from '../useReveal'
import { useGoToContact } from '../useGoToContact'

const plans = [
  {
    id: 'starter',
    name: 'Site vitrine',
    contactValue: 'Site Vitrine',
    Icon: Icon.Globe,
    tagline: 'Présentez votre activité avec un site élégant et rapide.',
    highlight: { text: '100% sur mesure', sub: 'Zéro template' },
    popular: false,
    cta: 'Prendre RDV gratuit',
    features: [
      "Jusqu'à 5 pages sur mesure",
      'Design responsive mobile & desktop',
      'Formulaire de contact',
      'Livraison en ~7 jours',
      'SEO de base',
    ],
  },
  {
    id: 'pro',
    name: 'Site pro',
    contactValue: 'Site Pro',
    Icon: Icon.Zap,
    tagline: 'La vitrine complète pour développer votre visibilité.',
    highlight: { text: '100% sur mesure', sub: 'Zéro template' },
    popular: true,
    cta: 'Prendre RDV gratuit',
    features: [
      "Jusqu'à 10 pages sur mesure",
      'Design responsive mobile & desktop',
      'SEO on-page optimisé',
      'Blog & galerie de réalisations',
      'Formation à la prise en main',
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    contactValue: 'E-Commerce',
    Icon: Icon.Cart,
    tagline: 'Vendez en ligne sans commission sur vos ventes.',
    highlight: { text: '0% de commission', sub: 'vs Shopify jusqu’à 2%' },
    popular: false,
    cta: 'Prendre RDV gratuit',
    features: [
      'Produits illimités',
      'Paiement en ligne intégré',
      'Dashboard admin & gestion stocks',
      'SEO on-page + Blog',
      "Intégration produits (jusqu'à 30 réf.)",
      'Formation à la prise en main',
    ],
  },
  {
    id: 'webapp',
    name: 'App restaurant',
    contactValue: 'App Restaurant',
    Icon: Icon.Utensils,
    tagline: 'Commandes et paiement en ligne, sans intermédiaire.',
    highlight: { text: '0% de commission', sub: 'vs Uber Eats jusqu’à 30%' },
    popular: false,
    cta: 'Prendre RDV gratuit',
    features: [
      'Commande à emporter & livraison',
      'Paiement en ligne intégré',
      'Dashboard gérant (plats, commandes)',
      'SEO optimisé',
      'Formation à la prise en main',
    ],
  },
]

function PricingCard({ plan, onSelect }) {
  const Ico = plan.Icon
  return (
    <div
      className={`pricing-card${plan.popular ? ' pricing-card--popular' : ''}`}
    >
      {plan.popular && (
        <div className="pricing-badge">Le plus populaire</div>
      )}

      <div className="pricing-card-body">
        <span className="pricing-icon"><Ico /></span>
        <h3 className="pricing-name">{plan.name}</h3>
        <p className="pricing-tagline">{plan.tagline}</p>

        <div className="pricing-highlight">
          <span className="pricing-highlight-text">{plan.highlight.text}</span>
          <span className="pricing-highlight-sub">{plan.highlight.sub}</span>
        </div>

        <ul className="pricing-features">
          {plan.features.map(f => (
            <li key={f} className="pricing-feature">
              <Icon.Check />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pricing-card-footer">
        <button className="pricing-cta" onClick={() => onSelect()}>
          {plan.cta}
          <span className="pricing-cta-arrow"><Icon.Arrow /></span>
        </button>
      </div>
    </div>
  )
}


export default function Services(){
  const headerRef = useReveal(0.2)
  const gridRef   = useReveal(0.05)
  const goToContact = useGoToContact()

  return (
    <section className="section" id="services">
      <div className="reveal-up" ref={headerRef}>
        <div className="section-label">Offres</div>
        <h2 className="section-title">Choisissez votre <em>offre</em></h2>
      </div>

      <div className="pricing-grid reveal-stagger" ref={gridRef}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={goToContact}
          />
        ))}
      </div>
    </section>
  )
}
