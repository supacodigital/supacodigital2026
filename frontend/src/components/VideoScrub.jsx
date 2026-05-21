import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vidéo dont la lecture (currentTime) est pilotée par le scroll.
 * Effet cinématique « Apple-style ». Le composant rend une vidéo
 * en position sticky ; c'est le PARENT qui doit fournir la hauteur
 * de scroll (≈ 200vh) via `scrollHeight`.
 *
 * Sur mobile / prefers-reduced-motion : pas de scrub, la vidéo
 * joue simplement en boucle (ou reste sur le poster).
 */
export default function VideoScrub({
  src,
  poster,
  className = "",
  scrollHeight = "200vh",
  zoom = [1.25, 1], // [scale au début, scale à la fin] — zoom-out progressif
  children,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video) return;

      const isTouch = window.matchMedia("(hover: none)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const [zoomFrom, zoomTo] = zoom;
      // Transform direct (hardware-accelerated, pas de recalc de layout)
      const setScale = (s) => {
        video.style.transform = `scale(${s})`;
      };
      setScale(zoomFrom);

      // Fallback : lecture en boucle, pas de scrub
      if (isTouch || reduced) {
        video.loop = true;
        setScale(reduced ? zoomTo : 1.08); // léger zoom statique sur mobile
        const tryPlay = () => video.play().catch(() => {});
        if (!reduced) tryPlay();
        return;
      }

      const setup = () => {
        const duration = video.duration || 1;

        // Objet proxy interpolé par ScrollTrigger (scrub lisse)
        const state = { t: 0 };

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // lissage : évite les sauts brutaux de currentTime
          onUpdate: (self) => {
            const p = self.progress;
            state.t = p * duration;
            // currentTime appliqué directement ; scrub gère déjà le lissage
            if (video.readyState >= 2) video.currentTime = state.t;
            // Zoom synchronisé avec la même progression de scroll
            setScale(zoomFrom + (zoomTo - zoomFrom) * p);
          },
        });

        ScrollTrigger.refresh();
        return st;
      };

      if (video.readyState >= 1) {
        setup();
      } else {
        video.addEventListener("loadedmetadata", setup, { once: true });
      }
    },
    { scope: containerRef, dependencies: [zoom] }
  );

  return (
    <div
      ref={containerRef}
      className={`vscrub ${className}`}
      style={{ height: scrollHeight }}
    >
      <div className="vscrub-sticky">
        <video
          ref={videoRef}
          src={src}
          {...(poster ? { poster } : {})}
          muted
          playsInline
          preload="auto"
          className="vscrub-video"
        />
        {children}
      </div>
    </div>
  );
}
