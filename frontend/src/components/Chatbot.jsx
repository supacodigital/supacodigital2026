import { useState, useEffect, useRef, useCallback } from 'react'
import { Icon } from '../icons'
import { API } from '../config'
import { trackEvent } from '../useAnalytics'

const SESSION_KEY = 'digi_conversation'
const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Bonjour ! Je suis Digi 👋\n\nJe peux vous aider à définir votre projet web et vous orienter vers la bonne solution — site vitrine, e-commerce, app sur mesure…\n\nDites-moi en quelques mots ce que vous cherchez, ou choisissez une question ci-dessous.'
}

const INITIAL_QUICK_REPLIES = [
  'Je veux un site vitrine',
  'Je lance une boutique en ligne',
  'Combien ça coûte ?',
  'Quel délai de livraison ?',
]

function loadHistory() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // sessionStorage indisponible ou données corrompues
  }
  return [INITIAL_MESSAGE]
}

function saveHistory(messages) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const [bubble, setBubble] = useState(false)
  const [quickReplies, setQuickReplies] = useState(INITIAL_QUICK_REPLIES)
  const msgsEnd = useRef(null)
  const notifiedRef = useRef(false)
  const panelRef = useRef(null)
  const dragY = useRef(0)
  const startY = useRef(0)

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  useEffect(() => {
    const about = document.getElementById('services')
    if (!about) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !notifiedRef.current) {
          notifiedRef.current = true
          setShowBadge(true)
          setBubble(true)
          setTimeout(() => setBubble(false), 5000)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(about)
    return () => observer.disconnect()
  }, [])

  // Swipe-to-close sur mobile
  const onTouchStart = useCallback(e => {
    startY.current = e.touches[0].clientY
    dragY.current = 0
  }, [])

  const onTouchMove = useCallback(e => {
    const delta = e.touches[0].clientY - startY.current
    if (delta < 0) return // ignore swipe vers le haut
    dragY.current = delta
    if (panelRef.current) {
      panelRef.current.style.transform = `translateY(${delta}px)`
      panelRef.current.style.transition = 'none'
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!panelRef.current) return
    if (dragY.current > 120) {
      // seuil dépassé → fermer avec animation slide-down
      panelRef.current.style.transition = 'transform 0.28s cubic-bezier(.4,0,.2,1)'
      panelRef.current.style.transform = 'translateY(100%)'
      setTimeout(() => setOpen(false), 260)
    } else {
      // snap back
      panelRef.current.style.transition = 'transform 0.22s cubic-bezier(.4,0,.2,1)'
      panelRef.current.style.transform = ''
      setTimeout(() => {
        if (panelRef.current) panelRef.current.style.transition = ''
      }, 220)
    }
    dragY.current = 0
  }, [])

  const clearHistory = () => {
    const fresh = [INITIAL_MESSAGE]
    setMessages(fresh)
    saveHistory(fresh)
    setQuickReplies(INITIAL_QUICK_REPLIES)
  }

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')
    setShowBadge(false)
    setQuickReplies([])
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      })
      const data = await res.json()
      if (data.leadCaptured) trackEvent('chatbot_lead_captured')
      setMessages(m => [...m, { role: 'assistant', content: data.reply || 'Une erreur est survenue.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Je ne suis pas disponible pour l\'instant. Contactez-nous directement !' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          className="chat-panel"
          role="dialog"
          aria-label="Chat avec Digi, assistant Supaco Digital"
        >
          <div
            className="chat-header"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="chat-avatar" aria-hidden="true"><Icon.Bot /></div>
            <div className="chat-header-info">
              <div className="chat-name">Digi — Assistant IA</div>
              <div className="chat-status">En ligne</div>
            </div>
            {messages.length > 1 && (
              <button
                className="chat-clear"
                onClick={clearHistory}
                aria-label="Effacer la conversation"
                title="Effacer la conversation"
              >
                <Icon.Refresh />
              </button>
            )}
            <button
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
            >
              <Icon.Close />
            </button>
          </div>

          <div
            className="chat-messages"
            aria-live="polite"
            aria-label="Messages du chat"
            role="log"
          >
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
                <div className="chat-msg-av" aria-hidden="true">{m.role === 'user' ? 'V' : 'D'}</div>
                <div className="chat-bubble" style={{ whiteSpace: 'pre-line' }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot" aria-label="Digi est en train d'écrire">
                <div className="chat-msg-av" aria-hidden="true">D</div>
                <div className="chat-bubble chat-skeleton" aria-hidden="true">
                  <div className="chat-skeleton-line chat-skeleton-line--long" />
                  <div className="chat-skeleton-line chat-skeleton-line--short" />
                </div>
              </div>
            )}
            <div ref={msgsEnd} />
          </div>

          {quickReplies.length > 0 && (
            <div className="chat-quick" aria-label="Réponses rapides" role="group">
              {quickReplies.map(q => (
                <button key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <label htmlFor="chat-input-field" className="sr-only">Votre message</label>
            <input
              id="chat-input-field"
              className="chat-input"
              placeholder="Décrivez votre projet..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              disabled={loading}
            />
            <button
              className="chat-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Envoyer le message"
            >
              <Icon.Send />
            </button>
          </div>
        </div>
      )}

      {bubble && !open && (
        <div className="chat-bubble-notify" aria-live="polite">
          👋 Bonjour ! Un projet en tête ? Je peux vous aider.
        </div>
      )}

      <button
        className={`chat-trigger${bubble && !open ? ' chat-trigger--notify' : ''}`}
        onClick={() => { if (!open) trackEvent('chatbot_open'); setOpen(o => !o); setShowBadge(false); setBubble(false) }}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat avec Digi'}
        aria-expanded={open}
      >
        {open ? <Icon.Close /> : <Icon.Bot />}
        {showBadge && !open && <span className="chat-trigger-badge" aria-hidden="true" />}
      </button>
    </>
  )
}
