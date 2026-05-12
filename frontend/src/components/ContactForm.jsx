import { useState, useEffect } from 'react'
import { Icon } from '../icons'
import { API } from '../config'
import LegalModal from './LegalModal'
import { trackEvent } from '../useAnalytics'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  useEffect(() => {
    const preset = sessionStorage.getItem('selectedService')
    if (preset) {
      setForm(f => ({ ...f, service: preset }))
      sessionStorage.removeItem('selectedService')
    }
  }, [])
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const [legal, setLegal] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { setErrMsg('Veuillez renseigner votre nom.'); setStatus('error'); return }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErrMsg('Veuillez renseigner un email valide.'); setStatus('error'); return }
    if (!form.message.trim()) { setErrMsg('Veuillez renseigner votre message.'); setStatus('error'); return }
    setStatus('loading')
    setErrMsg('')
    trackEvent('contact_submit', { service: form.service || 'non_renseigne' })
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error || 'Erreur lors de l\'envoi.'); setStatus('error'); return }
      trackEvent('contact_success', { service: form.service || 'non_renseigne' })
      setStatus('success')
    } catch {
      setErrMsg('Erreur réseau. Réessayez plus tard.')
      setStatus('error')
    }
  }

  const confettiColors = ['#00e5ff','#1a6bff','#ffffff','#0047cc','#00b8d4','#60efff']
  const confettiPieces = Array.from({ length: 36 }, (_, i) => ({
    color: confettiColors[i % confettiColors.length],
    left: `${Math.floor((i / 36) * 100)}%`,
    delay: `${(i * 0.08).toFixed(2)}s`,
    duration: `${0.9 + (i % 5) * 0.2}s`,
    size: i % 3 === 0 ? 10 : i % 3 === 1 ? 7 : 5,
    rotate: `${(i * 37) % 360}deg`,
  }))

  if (status === 'success') return (
    <div className="contact-form-wrap form-success-wrap" role="status">
      <div className="form-confetti" aria-hidden="true">
        {confettiPieces.map((p, i) => (
          <span key={i} className="form-confetti-piece" style={{
            left: p.left,
            background: p.color,
            width: p.size,
            height: p.size + 4,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate})`,
          }} />
        ))}
      </div>
      <div className="form-success">
        <div className="form-success-check" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="25" stroke="url(#g)" strokeWidth="2"/>
            <path d="M14 26l8 8 16-16" stroke="url(#g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00e5ff"/><stop offset="1" stopColor="#1a6bff"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h3 className="form-success-title">Message envoyé !</h3>
        <p className="form-success-sub">Je vous réponds sous <strong>24h</strong>. À très vite 👋</p>
        <div className="form-success-badge">Supaco Digital · Saint-Genis-Pouilly</div>
      </div>
    </div>
  )

  return (
    <div className="contact-form-wrap">
      <div className="form-title">Parlez-moi de votre projet</div>
      <form onSubmit={submit} aria-busy={status === 'loading'} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="f-name">Nom *</label>
            <input id="f-name" placeholder="Marie Dupont" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-field">
            <label htmlFor="f-email">Email *</label>
            <input id="f-email" type="email" placeholder="marie@exemple.fr" value={form.email} onChange={set('email')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="f-phone">Téléphone</label>
            <input id="f-phone" placeholder="06 00 00 00 00" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-field">
            <label htmlFor="f-service">Service souhaité</label>
            <select id="f-service" value={form.service} onChange={set('service')}>
              <option value="">Choisir...</option>
              <option>Starter</option>
              <option>Pro</option>
              <option>E-Commerce</option>
              <option>App Restaurant</option>
              <option>Projet sur mesure</option>
            </select>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="f-message">Votre message *</label>
          <textarea id="f-message" placeholder="Décrivez votre projet, vos objectifs, votre contexte..." value={form.message} onChange={set('message')} required />
        </div>
        <div className="form-consent">
          <input
            type="checkbox"
            id="f-consent"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            required
          />
          <label htmlFor="f-consent">
            J'accepte que mes données soient utilisées pour traiter ma demande. Voir notre{' '}
            <button type="button" className="form-consent-link" onClick={() => setLegal('privacy')}>
              politique de confidentialité
            </button>.
          </label>
        </div>
        {status === 'error' && (
          <p role="alert" style={{ color: '#ff3b6b', fontSize: 13, marginBottom: 12, fontFamily: 'var(--ff-ui)', letterSpacing: 1 }}>
            {errMsg}
          </p>
        )}
        {status === 'loading' ? (
          <div className="form-submit form-submit--skeleton" aria-label="Envoi en cours, veuillez patienter" aria-busy="true">
            <div className="form-skeleton-bar" />
          </div>
        ) : (
          <button
            className="form-submit"
            type="submit"
            disabled={!consent}
            aria-label="Envoyer le message"
          >
            <span>Envoyer le message</span><Icon.Arrow />
          </button>
        )}
      </form>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </div>
  )
}
