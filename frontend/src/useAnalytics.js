const GA_ID = import.meta.env.VITE_GA_ID

function gtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

export function trackEvent(eventName, params = {}) {
  if (!GA_ID) return
  gtag('event', eventName, params)
}

export function useAnalytics() {
  return {
    // CTAs principaux
    trackHeroCTA: (label) => trackEvent('cta_click', { category: 'hero', label }),
    trackNavCTA: (label) => trackEvent('cta_click', { category: 'navbar', label }),

    // Calendly
    trackCalendlyOpen: (source) => trackEvent('calendly_open', { source }),

    // Chatbot
    trackChatbotOpen: () => trackEvent('chatbot_open'),
    trackChatbotLead: () => trackEvent('chatbot_lead_captured'),

    // Contact form
    trackContactSubmit: () => trackEvent('contact_submit'),
    trackContactSuccess: () => trackEvent('contact_success'),

    // Projets
    trackProjectClick: (project) => trackEvent('project_click', { project }),

    // Scroll sections (utilisé avec IntersectionObserver)
    trackSectionView: (section) => trackEvent('section_view', { section }),
  }
}
