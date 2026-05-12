import { useEffect, useRef } from 'react'
import { Icon } from '../icons'
import { trackEvent } from '../useAnalytics'

export default function CaseStudyModal({ project, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    trackEvent('case_study_view', { project: project.name })
    const onKey = e => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab') {
        const focusable = closeRef.current?.closest('[role="dialog"]')?.querySelectorAll(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, project.name])

  const cs = project.caseStudy

  return (
    <div
      className="cs-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study — ${project.name}`}
    >
      <div className="cs-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="cs-header">
          <div className="cs-header-left">
            <div className="cs-tags">
              {project.tags.map(t => (
                <span key={t} className="cs-tag">{t}</span>
              ))}
              <span className="cs-year">{project.year}</span>
            </div>
            <h2 className="cs-title">{project.name}</h2>
          </div>
          <button
            className="cs-close"
            onClick={onClose}
            aria-label="Fermer"
            ref={closeRef}
          >
            <Icon.Close />
          </button>
        </div>

        <div className="cs-body">

          {/* ── Visuel ── */}
          <div className="cs-visual">
            {project.logo ? (
              <img src={project.logo} alt={project.name} className="cs-logo" loading="lazy" />
            ) : (
              <div className="cs-placeholder">{project.placeholder}</div>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="cs-site-link"
              onClick={() => trackEvent('case_study_site_click', { project: project.name })}
            >
              <span>Voir le site</span>
              <Icon.Arrow />
            </a>
          </div>

          {/* ── Résultats clés ── */}
          {cs.metrics && (
            <div className="cs-metrics">
              {cs.metrics.map((m, i) => (
                <div key={i} className="cs-metric">
                  <div className="cs-metric-value">{m.value}</div>
                  <div className="cs-metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Contenu ── */}
          <div className="cs-content">
            <div className="cs-block">
              <div className="cs-block-label">Le défi</div>
              <p className="cs-block-text">{cs.challenge}</p>
            </div>
            <div className="cs-block">
              <div className="cs-block-label">La solution</div>
              <p className="cs-block-text">{cs.solution}</p>
            </div>
            {cs.stack && (
              <div className="cs-block">
                <div className="cs-block-label">Stack technique</div>
                <div className="cs-stack">
                  {cs.stack.map(s => (
                    <span key={s} className="cs-stack-item">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {cs.testimonial && (
              <blockquote className="cs-testimonial">
                <p>"{cs.testimonial.text}"</p>
                <cite>— {cs.testimonial.author}</cite>
              </blockquote>
            )}
          </div>

          {/* ── CTA ── */}
          <div className="cs-footer">
            <a href="#contact" className="btn-primary" onClick={onClose}>
              <span>Démarrer mon projet</span>
              <Icon.Arrow />
            </a>
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-ghost cs-btn-ghost">
              <span>Voir le site live</span>
              <Icon.Arrow />
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
