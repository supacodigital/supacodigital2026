import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Position de scroll (px) où le volet est terminé et About « posé ».
 * Exposée pour que le scroll d'ancrage vers #propos vise le bon endroit
 * (la position layout d'About est faussée par le pin/transform).
 * `null` si le volet n'est pas actif (mobile/reduced-motion → ancre normale).
 */
export const heroPinState = { servicesScroll: null };

/**
 * Effet « volet » entre le Hero (vidéo) et la section About.
 *
 * Desktop : le hero reste épinglé (sticky du VideoScrub) pendant la dernière
 * portion de son scroll, About remonte par-dessus (y +100vh → 0) et un voile
 * assombrit le hero. Le scrub vidéo continue dessous.
 *
 * Mobile/tactile : pas de scrub ni de pin (trop lourd / scroll-jacking). On
 * recrée un volet léger : About remonte sur le hero pendant qu'il entre dans
 * le viewport + léger assombrissement. Déclenché par le scroll naturel.
 *
 * prefers-reduced-motion : aucune animation, overlap statique CSS.
 */
export function useHeroPin(enabled = true) {
  useGSAP(
    () => {
      if (!enabled) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const isTouch = window.matchMedia("(hover: none)").matches;
      const heroContainer = document.querySelector(".hero .vscrub");
      // Le « volet » s'applique à la 1ère section après le hero (Services)
      const panel = document.querySelector("#services");
      const veil = document.querySelector(".hero-veil-pin");
      if (!heroContainer || !panel || !veil) return;

      // Hauteur de référence = --app-vh (posée par main.jsx), EXACTEMENT la
      // même valeur que celle utilisée par le CSS (margin-top / transform du
      // panneau). Indispensable sur mobile où window.innerHeight ≠ 100vh.
      const vh = () => {
        const v = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--app-vh")
        );
        return v || window.innerHeight;
      };

      if (isTouch) {
        // ── Mobile : volet sans scrub vidéo, mais recouvrement complet ──
        // Le panneau (margin-top: -100vh en CSS) part hors écran (y +100vh)
        // et remonte à 0 → recouvre tout le hero, comme sur desktop.
        gsap.set(panel, { y: vh(), willChange: "transform" });
        gsap.set(veil, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top bottom", // le panneau entre par le bas du viewport
            end: "top top",      // le panneau atteint le haut
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        tl.to(veil, { opacity: 1, ease: "none" }, 0).to(
          panel,
          { y: 0, ease: "none" },
          0
        );

        const id = setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => clearTimeout(id);
      }

      // ── Desktop : volet « pin » sur la 2e moitié du scroll hero ──
      // Le panneau (margin-top: -100vh en CSS) est poussé hors écran (y +100vh)
      // puis remonte à 0 → volet qui se ferme.
      gsap.set(panel, { y: vh(), willChange: "transform" });
      gsap.set(veil, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainer,
          start: "50% top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            // Position où le volet est terminé → panneau posé, lisible
            heroPinState.servicesScroll = self.end;
          },
        },
      });
      tl.to(veil, { opacity: 1, ease: "none" }, 0).to(
        panel,
        { y: 0, ease: "none" },
        0
      );

      const id = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => {
        clearTimeout(id);
        heroPinState.servicesScroll = null;
      };
    },
    { dependencies: [enabled] }
  );
}
