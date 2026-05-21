import './Loader.css'

/**
 * Voile de fond pendant l'intro. La navbar (composant séparé) joue
 * l'animation : elle naît au centre (floue), se précise, puis monte
 * à sa position. Ce voile papier masque le hero puis se dissipe.
 *
 * phase : 'center' (opaque) → 'rising' (se dissipe).
 */
export default function Loader({ phase }) {
  const dissolving = phase === 'rising'
  return (
    <div
      className={`loader-veil${dissolving ? ' loader-veil--out' : ''}`}
      aria-hidden="true"
    />
  )
}
