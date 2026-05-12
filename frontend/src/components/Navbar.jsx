import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../icons'

const NAV_ITEMS = [
  { label: 'À propos',  href: '#propos' },
  { label: 'Services',  href: '#services' },
  { label: 'Projets',   href: '#projets' },
  { label: 'Contact',   href: '#contact' },
]

const SECTION_IDS = ['accueil', 'propos', 'services', 'projets', 'zone', 'faq', 'contact']

export default function Navbar({ navLogoRef, onOpenCalendly }) {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y < 80) {
        setVisible(true)
      } else {
        setVisible(y < lastY.current)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers = []
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Bloque le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const mobileMenu = menuOpen && createPortal(
    <div className="nav-mobile" role="dialog" aria-label="Menu de navigation">
      <div className="nav-mobile-header">
        <a href="#accueil" className="nav-logo" onClick={closeMenu}>
          <img src="/logo2026.webp" alt="Supaco Digital" />
          <span className="nav-logo-text">Supaco<span>.</span>Digital</span>
        </a>
        <button
          className="nav-mobile-close"
          aria-label="Fermer le menu"
          onClick={closeMenu}
        >
          <Icon.XMark />
        </button>
      </div>
      <ul role="list">
        {NAV_ITEMS.map(({ label, href }) => (
          <li key={label}>
            <a href={href} onClick={closeMenu}>{label}</a>
          </li>
        ))}
      </ul>
      <button className="nav-cta" onClick={() => { closeMenu(); onOpenCalendly() }}>
        Prendre RDV
      </button>
    </div>,
    document.body
  )

  return (
    <>
      <div className={`nav-wrap${scrolled ? ' scrolled' : ''}${!visible ? ' nav-wrap--hidden' : ''}`}>
        <nav className="nav" aria-label="Navigation principale">
          <a href="#accueil" className="nav-logo">
            <img ref={navLogoRef} src="/logo2026.webp" alt="Supaco Digital — retour accueil" fetchpriority="high" decoding="async" width="32" height="32" />
            <span className="nav-logo-text">Supaco<span>.</span>Digital</span>
          </a>

          <ul className="nav-links" role="list">
            {NAV_ITEMS.map(({ label, href }) => {
              const sectionId = href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={isActive ? 'nav-link--active' : ''}
                    aria-current={isActive ? 'true' : undefined}
                  >{label}</a>
                </li>
              )
            })}
          </ul>

          <button onClick={() => onOpenCalendly()} className="nav-cta">
            Prendre RDV
          </button>

          <button
            className="nav-burger"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <Icon.XMark /> : <Icon.Burger />}
          </button>
        </nav>
      </div>

      {mobileMenu}
    </>
  )
}
