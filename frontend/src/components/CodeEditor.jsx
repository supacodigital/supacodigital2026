import { useEffect, useRef, useState, useCallback } from 'react'
import './CodeEditor.css'

const CODE_LINES = [
  [
    { t: 'keyword', v: 'import' }, { t: 'plain', v: ' { ' },
    { t: 'func', v: 'useState' }, { t: 'plain', v: ' } ' },
    { t: 'keyword', v: 'from' }, { t: 'string', v: " 'react'" },
  ],
  [],
  [
    { t: 'keyword', v: 'export default function' }, { t: 'plain', v: ' ' },
    { t: 'func', v: 'SiteVitrine' }, { t: 'plain', v: '() {' },
  ],
  [
    { t: 'plain', v: '  ' },
    { t: 'keyword', v: 'const' }, { t: 'plain', v: ' [' },
    { t: 'var', v: 'open' }, { t: 'plain', v: ', ' },
    { t: 'func', v: 'setOpen' }, { t: 'plain', v: '] = ' },
    { t: 'func', v: 'useState' }, { t: 'plain', v: '(' },
    { t: 'bool', v: 'false' }, { t: 'plain', v: ')' },
  ],
  [],
  [{ t: 'plain', v: '  ' }, { t: 'keyword', v: 'return' }, { t: 'plain', v: ' (' }],
  [
    { t: 'plain', v: '    ' },
    { t: 'tag', v: '<' }, { t: 'component', v: 'main' },
    { t: 'attr', v: ' className' }, { t: 'plain', v: '=' },
    { t: 'string', v: '"site"' }, { t: 'tag', v: '>' },
  ],
  [
    { t: 'plain', v: '      ' },
    { t: 'tag', v: '<' }, { t: 'component', v: 'Hero' },
    { t: 'attr', v: ' title' }, { t: 'plain', v: '=' },
    { t: 'string', v: '"Votre présence en ligne"' },
    { t: 'tag', v: ' />' },
  ],
  [
    { t: 'plain', v: '      ' },
    { t: 'tag', v: '<' }, { t: 'component', v: 'Services' },
    { t: 'attr', v: ' onRDV' }, { t: 'plain', v: '={' },
    { t: 'func', v: 'openCalendly' }, { t: 'plain', v: '}' },
    { t: 'tag', v: ' />' },
  ],
  [
    { t: 'plain', v: '      ' },
    { t: 'tag', v: '<' }, { t: 'component', v: 'Contact' },
    { t: 'attr', v: ' city' }, { t: 'plain', v: '=' },
    { t: 'string', v: '"Saint-Genis-Pouilly"' },
    { t: 'tag', v: ' />' },
  ],
  [
    { t: 'plain', v: '      ' },
    { t: 'tag', v: '<' }, { t: 'component', v: 'Chatbot' },
    { t: 'attr', v: ' name' }, { t: 'plain', v: '=' },
    { t: 'string', v: '"Digi"' },
    { t: 'tag', v: ' />' },
  ],
  [
    { t: 'plain', v: '    ' },
    { t: 'tag', v: '</' }, { t: 'component', v: 'main' }, { t: 'tag', v: '>' },
  ],
  [{ t: 'plain', v: '  )' }],
  [{ t: 'plain', v: '}' }],
]

const TOTAL_TOKENS = CODE_LINES.reduce((acc, l) => acc + l.length, 0)

const SERVICES = [
  {
    id: 'vitrine',
    icon: '🌐',
    name: 'Site Vitrine',
    desc: 'Présence en ligne élégante, livrée en ~7 jours. Design sur mesure, SEO natif, hébergement inclus.',
    features: ['Jusqu\'à 10 pages', 'SEO on-page', 'Responsive', 'Support 48h'],
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.18)',
    tag: 'Le plus demandé',
  },
  {
    id: 'ecommerce',
    icon: '🛍️',
    name: 'E-Commerce',
    desc: 'Boutique complète avec paiement en ligne, dashboard admin et gestion des stocks.',
    features: ['Produits illimités', 'Paiement sécurisé', '0% commission', 'Formation incluse'],
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
    tag: null,
  },
  {
    id: 'webapp',
    icon: '⚡',
    name: 'App Web sur mesure',
    desc: 'SaaS, outil métier, marketplace — on développe votre idée de A à Z en React & Node.js.',
    features: ['Architecture custom', 'API & base de données', 'Dashboard client', 'Évolutif'],
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.18)',
    tag: null,
  },
]

function Token({ type, value }) {
  return <span className={`ce-token ce-token--${type}`}>{value}</span>
}

function ServiceCard({ s, index, visible }) {
  return (
    <div
      className={`ce-card${visible ? ' ce-card--visible' : ''}`}
      style={{
        '--card-color': s.color,
        '--card-glow': s.glow,
        transitionDelay: visible ? `${0.1 + index * 0.12}s` : '0s',
      }}
    >
      {s.tag && <div className="ce-card-tag">{s.tag}</div>}
      <div className="ce-card-icon">{s.icon}</div>
      <div className="ce-card-name">{s.name}</div>
      <p className="ce-card-desc">{s.desc}</p>
      <ul className="ce-card-features">
        {s.features.map(f => (
          <li key={f} className="ce-card-feature">
            <span className="ce-card-check">✓</span>{f}
          </li>
        ))}
      </ul>
      <div className="ce-card-cta">Sur devis <span>→</span></div>
    </div>
  )
}

export default function CodeEditor() {
  const sectionRef = useRef(null)
  const [visibleTokens, setVisibleTokens] = useState(0)
  const [sectionVisible, setSectionVisible] = useState(false)
  // phase: 'code' | 'boom' | 'result'
  const [phase, setPhase] = useState('code')
  const hasExplodedRef = useRef(false)
  const boomTimerRef = useRef(null)

  const triggerBoom = useCallback(() => {
    if (hasExplodedRef.current) return
    hasExplodedRef.current = true
    setPhase('boom')
    boomTimerRef.current = setTimeout(() => setPhase('result'), 700)
  }, [])

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const winH = window.innerHeight
      const raw = (winH - rect.top) / (rect.height + winH * 0.2)
      const p = Math.max(0, Math.min(1, raw))
      setSectionVisible(p > 0.05)

      if (!hasExplodedRef.current) {
        setVisibleTokens(Math.round(p * TOTAL_TOKENS))
        if (p >= 0.92) triggerBoom()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(boomTimerRef.current)
    }
  }, [triggerBoom])

  // Construire les lignes
  let remaining = visibleTokens
  const renderedLines = CODE_LINES.map((line) => {
    if (remaining <= 0) return { tokens: [] }
    const tokens = []
    for (let ti = 0; ti < line.length; ti++) {
      if (remaining > 0) { tokens.push(line[ti]); remaining-- }
      else break
    }
    return { tokens }
  })

  let activeLine = 0
  for (let i = 0; i < renderedLines.length; i++) {
    if (renderedLines[i].tokens.length > 0) activeLine = i
  }

  const isResult = phase === 'result'
  const isBoom   = phase === 'boom'
  const isCode   = phase === 'code'

  return (
    <section className="ce-section" ref={sectionRef}>
      <div className="ce-inner">

        {/* Texte gauche */}
        <div className={`ce-text${sectionVisible ? ' ce-text--visible' : ''}`}>
          <div className="section-label">Notre stack</div>
          <h2 className="section-title">
            Du vrai code,<br />fait <em>sur mesure</em>
          </h2>
          <p className="ce-desc">
            Pas de WordPress, pas de template. Chaque site est développé en React — rapide, évolutif, et unique comme votre activité.
          </p>
          <ul className="ce-pills">
            {['React', 'Node.js', 'Vite', 'CSS custom', 'SEO natif'].map(t => (
              <li key={t} className="ce-pill">{t}</li>
            ))}
          </ul>
        </div>

        {/* Zone droite : éditeur OU résultat */}
        <div className={`ce-editor-wrap${sectionVisible ? ' ce-editor-wrap--visible' : ''}`}>
          <div className="ce-glow" />

          {/* ── Flash boom ── */}
          {isBoom && <div className="ce-boom-flash" />}

          {/* ── Badge "compiled" ── */}
          {isResult && (
            <div className="ce-compiled-badge">
              <span className="ce-compiled-dot" />
              ✓ Compiled successfully in 0.3s
            </div>
          )}

          {/* ── Éditeur (visible en phase 'code' ou pendant le boom) ── */}
          <div className={`ce-editor${isBoom ? ' ce-editor--boom' : ''}${isResult ? ' ce-editor--hidden' : ''}`}>
            <div className="ce-titlebar">
              <div className="ce-dots">
                <span className="ce-dot ce-dot--red" />
                <span className="ce-dot ce-dot--yellow" />
                <span className="ce-dot ce-dot--green" />
              </div>
              <div className="ce-tabs">
                <div className="ce-tab ce-tab--active">
                  <span className="ce-tab-icon">⚛</span>
                  SiteVitrine.jsx
                </div>
                <div className="ce-tab">index.css</div>
                <div className="ce-tab">app.js</div>
              </div>
              <div className="ce-titlebar-right">
                <span className="ce-badge">JSX</span>
              </div>
            </div>

            <div className="ce-body">
              <div className="ce-sidebar">
                <div className="ce-sidebar-section">EXPLORER</div>
                <div className="ce-file ce-file--open"><span className="ce-file-arrow">▾</span> src</div>
                <div className="ce-file ce-file--active"><span className="ce-file-indent" />⚛ SiteVitrine.jsx</div>
                <div className="ce-file"><span className="ce-file-indent" />⚛ Hero.jsx</div>
                <div className="ce-file"><span className="ce-file-indent" />⚛ Services.jsx</div>
                <div className="ce-file"><span className="ce-file-indent" />⚛ Contact.jsx</div>
                <div className="ce-file"><span className="ce-file-indent" />🎨 index.css</div>
              </div>

              <div className="ce-code-area">
                <div className="ce-line-numbers">
                  {CODE_LINES.map((_, i) => (
                    <div key={i} className={`ce-line-num${i === activeLine ? ' ce-line-num--active' : ''}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="ce-code">
                  {renderedLines.map((line, li) => (
                    <div key={li} className={`ce-line${li === activeLine ? ' ce-line--active' : ''}`}>
                      {line.tokens.map((tok, ti) => (
                        <Token key={ti} type={tok.t} value={tok.v} />
                      ))}
                      {li === activeLine && isCode && visibleTokens < TOTAL_TOKENS && (
                        <span className="ce-cursor" />
                      )}
                      {/* curseur qui pulse avant le boom */}
                      {li === activeLine && isCode && visibleTokens >= TOTAL_TOKENS && (
                        <span className="ce-cursor ce-cursor--ready" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ce-statusbar">
              <span className="ce-status-item ce-status-item--branch">⎇ main</span>
              <span className="ce-status-item">React</span>
              <span className="ce-status-item">JSX</span>
              <span className="ce-status-item ce-status-item--right">
                Ln {activeLine + 1}, Col {(renderedLines[activeLine]?.tokens.reduce((a, t) => a + t.v.length, 0) || 0) + 1}
              </span>
              <span className={`ce-status-item${visibleTokens >= TOTAL_TOKENS && isCode ? ' ce-status-item--compiling' : ' ce-status-item--ok'}`}>
                {visibleTokens >= TOTAL_TOKENS && isCode ? '⟳ Compiling…' : '✓ 0 errors'}
              </span>
            </div>
          </div>

          {/* ── Résultat : 3 cartes de services ── */}
          <div className={`ce-result${isResult ? ' ce-result--visible' : ''}`}>
            <div className="ce-result-header">
              <span className="ce-result-label">Aperçu du rendu</span>
              <span className="ce-result-browser">
                <span className="ce-result-dot" />
                <span className="ce-result-dot" />
                <span className="ce-result-dot" />
              </span>
            </div>
            <div className="ce-cards-grid">
              {SERVICES.map((s, i) => (
                <ServiceCard key={s.id} s={s} index={i} visible={isResult} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
