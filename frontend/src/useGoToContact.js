import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Remplace l'ouverture de Calendly : tous les CTA "Prendre RDV" / "Réserver un
 * appel" amènent désormais au formulaire de contact (#contact).
 *
 * - Sur la home : scroll animé (GSAP) vers la section #contact.
 * - Hors home (ex. /a-propos) : navigation vers / avec la cible, Home scrolle
 *   au montage (via location.state.scrollTo, déjà géré dans Home.jsx).
 */
export function useGoToContact(navOffset = 28) {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "contact" } });
      return;
    }
    const el = document.getElementById("contact");
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetY = el.getBoundingClientRect().top + window.scrollY - navOffset;
    gsap.to(window, {
      duration: reduced ? 0 : 0.5,
      ease: "power3.out",
      scrollTo: { y: targetY, autoKill: false },
      overwrite: true,
      onComplete: () => history.replaceState(null, "", "#contact"),
    });
  };
}
