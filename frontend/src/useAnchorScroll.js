import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { heroPinState } from "./useHeroPin";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Scroll d'ancrage fiable malgré le hero « pinné » (volet).
 *
 * Le hero occupe 220vh de scroll et la section About a margin-top: -100vh
 * pour l'effet volet : du coup la position « layout » des ancres après le
 * hero ne correspond pas à leur position visuelle. Le saut d'ancre natif
 * du navigateur tombe donc à côté.
 *
 * On intercepte les clics sur les liens internes (href="#id") et on scrolle
 * vers la position VISUELLE réelle (getBoundingClientRect), avec un léger
 * offset pour dégager la navbar.
 */
export function useAnchorScroll(navOffset = 28) {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Cas spécial #services : cette section est pilotée par le volet (pin),
      // sa position layout est faussée. On vise la position de scroll EXACTE
      // où le volet est terminé (exposée par useHeroPin), sinon scroll normal.
      //
      // On fige une cible Y NUMÉRIQUE au moment du clic (plutôt que de passer
      // l'élément à GSAP) : sinon, si une section au-dessus change de hauteur
      // pendant le scroll (animations de reveal), GSAP « re-suit » la cible et
      // le scroll traîne — d'où la sensation de manque de réactivité.
      const targetY =
        id === "services" && heroPinState.servicesScroll != null
          ? heroPinState.servicesScroll
          : el.getBoundingClientRect().top + window.scrollY - navOffset;

      gsap.to(window, {
        // ease-out : démarre fort (réactif au clic) puis décélère en douceur
        duration: reduced ? 0 : 0.5,
        ease: "power3.out",
        scrollTo: { y: targetY, autoKill: false },
        overwrite: true,
        onComplete: () => history.replaceState(null, "", `#${id}`),
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navOffset]);
}
