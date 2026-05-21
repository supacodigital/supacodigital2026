import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/Seo";
import Hero from "../components/Hero";
import CodeEditor from "../components/CodeEditor";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import { useHeroPin, heroPinState } from "../useHeroPin";
import { useAnchorScroll } from "../useAnchorScroll";

export default function Home({ introDone }) {
  const location = useLocation();

  // Effet « volet » Hero → Services — activé une fois l'intro terminée
  // (no-op sur mobile/reduced-motion)
  useHeroPin(introDone);

  // Scroll d'ancrage fiable (corrige le décalage dû au hero pinné)
  useAnchorScroll();

  // Arrivée depuis une autre page avec une cible d'ancre (ex: clic "Services"
  // depuis /a-propos) → on scrolle vers la section une fois la home montée.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (!el) return;
      // #services est piloté par le volet : viser la position de fin de volet
      const y =
        target === "services" && heroPinState.servicesScroll != null
          ? heroPinState.servicesScroll
          : el.getBoundingClientRect().top + window.scrollY - 28;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: reduced ? "auto" : "smooth",
      });
      // nettoie le state pour éviter un re-scroll au prochain render
      window.history.replaceState({}, "");
    }, 400);
    return () => clearTimeout(t);
  }, [location.state]);

  return (
    <main>
      <Seo
        title="Supaco Digital — Création de Sites Web | Pays de Gex, Saint-Genis-Pouilly"
        description="Agence web freelance à Saint-Genis-Pouilly (Pays de Gex). Création de sites vitrines, e-commerce et applications web sur mesure. Réponse en 24h, appel découverte gratuit."
        path="/"
      />
      <Hero />
      <Services />
      <div className="divider divider--dark" />
      <div className="divider divider--light" />
      <Projects />
      <div className="divider" />
      <Testimonials />
      <div className="divider" />
      <FAQ />
      <div className="divider" />
      <Contact />
    </main>
  );
}
