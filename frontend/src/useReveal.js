import { useEffect, useRef } from 'react'

/**
 * Observe un élément et ajoute la classe `is-visible` dès qu'il entre dans le viewport.
 * @param {number} threshold  - fraction visible avant déclenchement (défaut 0.15)
 * @param {string} rootMargin - marge IntersectionObserver (défaut '0px 0px -60px 0px')
 */
export function useReveal(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Si la préférence utilisateur est reduced-motion, skip l'animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
