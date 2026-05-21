# 📚 Bibliothèque Stack — Supaco Digital

> Ressources, outils et techniques réutilisables pour tous les projets React + Vite.  
> Mise à jour au fil des projets.

---

## ⚙️ Stack de référence

```
Frontend  : React + Vite + CSS Modules + Lucide React + Axios
Backend   : Node.js + Express + MySQL (raw SQL, pas d'ORM)
Dev local : MAMP (port 8889, user root, password root)
Prod      : Hostinger VPS (PM2 + Nginx + Certbot)
           O2switch (Phusion Passenger via cPanel + Let's Encrypt)
```

**Conventions globales :**
- CSS Modules uniquement (`.module.css`) — migration depuis SCSS en cours
- Composants React fonctionnels uniquement
- Commentaires en français, noms de variables/fonctions en anglais
- Pas de `console.log` en production
- Pas de styles inline
- SQL brut uniquement (pas d'ORM)
- Architecture backend : `routes → controllers → services → repositories`

---

## 🎬 Animation

### GSAP + @gsap/react
**Cas d'usage :** Scroll complexe, parallax, ScrollTrigger, animations orchestrées

```bash
npm install gsap @gsap/react
```

- Toujours utiliser via le hook `useGSAP()` (pas `useEffect`)
- `ScrollTrigger` pour tout ce qui est piloté par le scroll

### Framer Motion
**Cas d'usage :** Transitions de composants React, mount/unmount, transitions de pages

```bash
npm install framer-motion
```

- Utiliser via `motion.*` (ex: `motion.div`, `motion.section`)
- Préférer Framer Motion pour les animations d'entrée/sortie de composants
- Préférer GSAP pour les animations liées au scroll

> Les deux coexistent dans la même stack selon le cas d'usage.

---

## 🎞️ Lottie

### lottie-react
**Cas d'usage :** Icônes UI animées, illustrations thématiques

```bash
npm install lottie-react
```

**Sources :**

| Source | Usage | Lien |
|---|---|---|
| **LottieFlow** | Icônes UI animées (hamburger, loader, scroll indicator, success...) | [lottieflow.com](https://lottieflow.com) |
| **LottieFiles** | 800k+ animations thématiques (food, restaurant, e-commerce...) | [lottiefiles.com](https://lottiefiles.com) |

> Lucide React reste la référence pour toute l'UI courante. Les trois (Lucide + LottieFlow + LottieFiles) coexistent.

---

## 🛠️ Outils additionnels

### Storybook
**Catalogue de composants réutilisables** — documenter et tester les composants en isolation.

```bash
npx storybook@latest init
```

### Zod
**Validation de schémas** — front + back, même logique de validation partagée.

```bash
npm install zod
```

### React Query / TanStack Query
**Gestion des fetches** — cache, états loading/error, refetch automatique.

```bash
npm install @tanstack/react-query
```

---

## 🎨 Ressources Design

### Effets CSS & Backgrounds

| Outil | Usage | Lien |
|---|---|---|
| **Haikei** | Générateur de blobs, vagues, formes SVG | [haikei.app](https://haikei.app) |
| **CSS Gradient** | Générateur de dégradés CSS | [cssgradient.io](https://cssgradient.io) |
| **ui.glass** | Effets glassmorphism | [ui.glass](https://ui.glass) |
| **SVG Backgrounds** | Backgrounds SVG patterns | [svgbackgrounds.com](https://svgbackgrounds.com) |
| **Patternpad** | Générateur de patterns | [patternpad.com](https://patternpad.com) |
| **Grainy Gradients** | Dégradés avec texture grain | [grainy-gradients.netlify.app](https://grainy-gradients.netlify.app) |

### Illustrations SVG

| Outil | Usage | Lien |
|---|---|---|
| **unDraw** | Illustrations SVG open-source | [undraw.co](https://undraw.co) |
| **Storyset** | Illustrations animables | [storyset.com](https://storyset.com) |
| **SVGRepo** | 500k+ icônes et SVG | [svgrepo.com](https://svgrepo.com) |
| **Shapedivider** | Séparateurs de sections SVG | [shapedivider.app](https://shapedivider.app) |

### Typographie

| Outil | Usage | Lien |
|---|---|---|
| **Fontshare** | Polices premium gratuites | [fontshare.com](https://fontshare.com) |
| **Fontsource** | Import de polices via npm | [fontsource.org](https://fontsource.org) |

```bash
# Exemple install Fontsource
npm install @fontsource/inter
```

---

## 🤖 AI & Design Agents

### Taste Skill
**Anti-slop frontend framework** — fichiers SKILL.md pour guider les agents AI vers des rendus premium et sortir du CSS générique.

- **Site :** [tasteskill.dev](https://www.tasteskill.dev)
- **GitHub :** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- **Compatible :** Claude Code, Cursor, Codex, Gemini CLI, v0, Lovable

```bash
npx skills add Leonxlnx/taste-skill
```

**Skills disponibles :**

| Skill | Usage |
|---|---|
| `taste-skill` | All-rounder frontend premium (défaut) |
| `soft-skill` | Interfaces calmes, whitespace, contraste doux |
| `minimalist-skill` | Editorial, structure serrée, hiérarchie nette |
| `brutalist-skill` | Swiss typo, contraste dur *(beta)* |
| `redesign-skill` | Audit + redesign d'un projet existant |
| `output-skill` | Évite les outputs incomplets / placeholders |
| `gpt-tasteskill` | Variante pour GPT/Codex |
| `image-to-code-skill` | Génère des références visuelles puis code |

---

## 🎬 Vidéo & Effets Scroll

### MotionSites.ai
**Bibliothèque de vidéos courtes** (boucles ~5s) pour effets visuels premium.

- **Site :** [motionsites.ai](https://motionsites.ai)
- **Modèle :** Freemium (vidéos gratuites + payantes)
- **Usage :** Backgrounds hero, transitions entre sections, éléments décoratifs

---

### Technique 1 — Vidéo déclenchée au scroll
**Niveau :** Intermédiaire | **Impact :** ⭐⭐⭐ | **Perf :** ✅ Léger

La vidéo démarre quand la section entre dans le viewport, se met en pause quand elle en sort.

**Cas d'usage :** Hero section, ambiance restaurant/e-commerce, section produit.

```jsx
// VideoSection.jsx
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './VideoSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const VideoSection = ({ src, poster }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    const video = videoRef.current

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => video.play(),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play(),
      onLeaveBack: () => video.pause(),
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={styles.container}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        className={styles.video}
      />
    </div>
  )
}

export default VideoSection
```

---

### Technique 2 — Scrubbing vidéo contrôlé par le scroll
**Niveau :** Avancé | **Impact :** ⭐⭐⭐⭐⭐ | **Perf :** ⚠️ Encodage spécifique requis

Le scroll pilote `video.currentTime` — avancer dans la page = avancer dans la vidéo. Effet cinématique Apple-style.

**Cas d'usage :** Landing page premium, storytelling, présentation produit immersive.

```jsx
// VideoScrub.jsx
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './VideoScrub.module.css'

gsap.registerPlugin(ScrollTrigger)

const VideoScrub = ({ src }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    const video = videoRef.current

    // Attendre que les métadonnées soient chargées
    video.addEventListener('loadedmetadata', () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          video.currentTime = self.progress * video.duration
        },
      })
    })
  }, { scope: containerRef })

  return (
    // Container haut pour laisser de la place au scroll
    <div ref={containerRef} className={styles.container}>
      <div className={styles.sticky}>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          className={styles.video}
        />
      </div>
    </div>
  )
}

export default VideoScrub
```

> ⚠️ **Encodage pour le scrubbing :** La vidéo doit avoir des keyframes fréquents pour une navigation fluide.
> ```bash
> ffmpeg -i input.mp4 -g 1 output.mp4
> ```

---

### Quand utiliser quelle technique ?

| Contexte | Technique |
|---|---|
| Vitrine restaurant / ambiance | Technique 1 (play/pause) |
| Landing page premium / storytelling | Technique 2 (scrubbing) |
| Section hero avec boucle vidéo | Technique 1 |
| Présentation produit cinématique | Technique 2 |
| Projet avec contraintes performance | Technique 1 |
| Budget temps serré | Technique 1 |
