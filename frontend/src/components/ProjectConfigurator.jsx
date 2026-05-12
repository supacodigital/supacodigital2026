import { useState } from 'react'
import { Icon } from '../icons'
import { trackEvent } from '../useAnalytics'

const TYPES = [
  { id: 'vitrine',    label: 'Site vitrine',    icon: '🖥️',  desc: 'Présenter votre activité en ligne' },
  { id: 'ecommerce',  label: 'Boutique en ligne', icon: '🛍️',  desc: 'Vendre vos produits sans commission' },
  { id: 'restaurant', label: 'App restaurant',   icon: '🍽️',  desc: 'Commandes & paiement en ligne' },
  { id: 'sur-mesure', label: 'Projet sur mesure', icon: '⚙️',  desc: 'Marketplace, SaaS, outil métier…' },
]

const OPTIONS = [
  { id: 'seo',       label: 'SEO avancé',          icon: '📈', desc: 'Apparaître sur Google',          plans: ['vitrine', 'ecommerce', 'restaurant', 'sur-mesure'] },
  { id: 'blog',      label: 'Blog / Actualités',   icon: '✍️',  desc: 'Publier du contenu',             plans: ['vitrine', 'ecommerce'] },
  { id: 'booking',   label: 'Réservation en ligne', icon: '📅', desc: 'Calendrier & prise de RDV',      plans: ['vitrine', 'sur-mesure'] },
  { id: 'paiement',  label: 'Paiement en ligne',   icon: '💳', desc: 'Stripe, Apple Pay…',             plans: ['ecommerce', 'restaurant', 'sur-mesure'] },
  { id: 'multilingue', label: 'Site multilingue',  icon: '🌍', desc: 'FR + EN ou CH',                  plans: ['vitrine', 'ecommerce', 'sur-mesure'] },
  { id: 'dashboard', label: 'Dashboard admin',     icon: '📊', desc: 'Gérer votre contenu',            plans: ['ecommerce', 'restaurant', 'sur-mesure'] },
  { id: 'chatbot',   label: 'Chatbot IA',          icon: '🤖', desc: 'Assistant intelligent 24/7',     plans: ['vitrine', 'ecommerce', 'sur-mesure'] },
  { id: 'logo',      label: 'Création logo',       icon: '🎨', desc: 'Identité visuelle complète',     plans: ['vitrine', 'ecommerce', 'restaurant', 'sur-mesure'] },
]

const URGENCES = [
  { id: 'flexible', label: 'Flexible',    desc: 'Pas de contrainte de délai' },
  { id: 'normal',   label: '< 1 mois',   desc: 'Dans le mois qui vient' },
  { id: 'urgent',   label: '< 2 semaines', desc: 'Projet urgent' },
]

const SUMMARY = {
  vitrine:    { titre: 'Site vitrine sur mesure', base: 'Design unique, responsive, formulaire de contact, SEO de base.' },
  ecommerce:  { titre: 'Boutique e-commerce',     base: 'Produits illimités, 0% commission, paiement en ligne, dashboard.' },
  restaurant: { titre: 'App restaurant',          base: 'Menu en ligne, commande à emporter, paiement, dashboard gérant.' },
  'sur-mesure': { titre: 'Projet sur mesure',     base: 'Architecture, stack et fonctionnalités définies ensemble lors du RDV.' },
}

export default function ProjectConfigurator({ onOpenCalendly }) {
  const [type, setType] = useState(null)
  const [options, setOptions] = useState([])
  const [urgence, setUrgence] = useState(null)
  const [expanded, setExpanded] = useState(false)

  function toggleOption(id) {
    setOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleRDV() {
    trackEvent('configurator_rdv', {
      type,
      options: options.join(','),
      urgence,
    })
    onOpenCalendly()
  }

  const availableOptions = type ? OPTIONS.filter(o => o.plans.includes(type)) : []
  const summary = type ? SUMMARY[type] : null
  const selectedOptions = OPTIONS.filter(o => options.includes(o.id))
  const hasConfig = type !== null

  return (
    <div className="config-wrap">
      <div className="config-header">
        <div className="config-tag">Configurateur</div>
        <h3 className="config-title">Construisez votre projet <em>en 3 étapes</em></h3>
        <p className="config-sub">Sélectionnez vos besoins — on en discute ensemble lors d'un appel gratuit.</p>
      </div>

      <div className="config-body">

        {/* ── Étape 1 : Type ── */}
        <div className="config-step">
          <div className="config-step-label">
            <span className="config-step-num">01</span>
            Quel type de projet ?
          </div>
          <div className="config-types">
            {TYPES.map(t => (
              <button
                key={t.id}
                className={`config-type${type === t.id ? ' config-type--active' : ''}`}
                onClick={() => { setType(t.id); setOptions([]) }}
              >
                <span className="config-type-icon">{t.icon}</span>
                <span className="config-type-label">{t.label}</span>
                <span className="config-type-desc">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Étape 2 : Options ── */}
        {type && (
          <div className="config-step config-step--appear">
            <div className="config-step-label">
              <span className="config-step-num">02</span>
              Quelles fonctionnalités ?
              <span className="config-step-optional">Optionnel</span>
            </div>
            <div className="config-options">
              {availableOptions.map(o => (
                <button
                  key={o.id}
                  className={`config-option${options.includes(o.id) ? ' config-option--active' : ''}`}
                  onClick={() => toggleOption(o.id)}
                >
                  <span className="config-option-icon">{o.icon}</span>
                  <span className="config-option-label">{o.label}</span>
                  <span className="config-option-desc">{o.desc}</span>
                  <span className="config-option-check">
                    {options.includes(o.id) ? <Icon.Check /> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Étape 3 : Urgence ── */}
        {type && (
          <div className="config-step config-step--appear">
            <div className="config-step-label">
              <span className="config-step-num">03</span>
              Quel délai ?
            </div>
            <div className="config-urgences">
              {URGENCES.map(u => (
                <button
                  key={u.id}
                  className={`config-urgence${urgence === u.id ? ' config-urgence--active' : ''}`}
                  onClick={() => setUrgence(u.id)}
                >
                  <span className="config-urgence-label">{u.label}</span>
                  <span className="config-urgence-desc">{u.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Résumé + CTA ── */}
        {hasConfig && (
          <div className="config-result config-step--appear">
            <div className="config-result-inner">
              <div className="config-result-left">
                <div className="config-result-tag">Votre projet</div>
                <div className="config-result-title">{summary.titre}</div>
                <p className="config-result-base">{summary.base}</p>
                {selectedOptions.length > 0 && (
                  <div className="config-result-opts">
                    {selectedOptions.map(o => (
                      <span key={o.id} className="config-result-opt">
                        {o.icon} {o.label}
                      </span>
                    ))}
                  </div>
                )}
                {urgence && (
                  <div className="config-result-urgence">
                    ⏱ {URGENCES.find(u => u.id === urgence)?.desc}
                  </div>
                )}
              </div>
              <div className="config-result-right">
                <div className="config-result-price-label">Tarif</div>
                <div className="config-result-price">Sur devis</div>
                <div className="config-result-price-sub">Appel gratuit · Réponse 24h</div>
                <button className="btn-primary config-result-cta" onClick={handleRDV}>
                  <span>Discuter de mon projet</span>
                  <Icon.Arrow />
                </button>
                <p className="config-result-note">
                  30 min · Sans engagement · Disponible cette semaine
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder avant sélection */}
        {!hasConfig && (
          <div className="config-placeholder">
            <div className="config-placeholder-icon">→</div>
            <p>Sélectionnez un type de projet pour commencer</p>
          </div>
        )}

      </div>
    </div>
  )
}
