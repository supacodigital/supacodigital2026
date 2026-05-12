import { Icon } from "../icons";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "../useReveal";

const STATS = [
  {
    value: 20,
    suffix: "+",
    label: "Projets livrés",
    desc: "Sites et apps en production",
  },
  {
    value: 7,
    suffix: "j",
    label: "Délai moyen",
    desc: "Pour un site vitrine complet",
  },
  {
    value: 100,
    suffix: "%",
    label: "Sur mesure",
    desc: "Zéro template, zéro copier-coller",
  },
  {
    value: 5,
    suffix: "★",
    label: "Note Google",
    desc: "Avis vérifiés de vrais clients",
  },
];

const VALEURS = [
  {
    icon: "⚡",
    titre: "Livraison rapide",
    desc: "Un site vitrine en 7 jours. Une app en 2-3 semaines. Pas de délais à rallonge.",
  },
  {
    icon: "🎯",
    titre: "Orienté résultats",
    desc: "L'objectif n'est pas un beau site — c'est plus de clients et plus de ventes.",
  },
  {
    icon: "🤝",
    titre: "Interlocuteur unique",
    desc: "Kevin de A à Z. Pas de sous-traitant, pas de chaine de mails. Un contact direct.",
  },
];

const STACK = ["React", "Node.js", "Vite", "SCSS"];

export default function About() {
  const statsRef = useRef(null);
  const [vals, setVals] = useState(STATS.map(() => 0));
  const [animated, setAnimated] = useState(false);

  const photoRef = useReveal(0.15);
  const mainRef = useReveal(0.1);
  const asideRef = useReveal(0.1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setAnimated(true);
        const duration = 1800;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVals(STATS.map((s) => Math.round(ease * s.value)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section about" id="propos">
      <div className="about-inner">
        {/* ── Colonne 1 : Photo + valeurs ── */}
        <div className="about-photo-wrap reveal-left" ref={photoRef}>
          <div className="about-mesh">
            <div className="about-mesh-blob about-mesh-blob--1" />
            <div className="about-mesh-blob about-mesh-blob--2" />
            <div className="about-mesh-blob about-mesh-blob--3" />
          </div>
          <div className="about-photo-frame">
            <img
              src="/kevin.webp"
              alt="Kevin — Supaco Digital"
              className="about-photo"
              loading="lazy"
              decoding="async"
              width="180"
              height="180"
            />
          </div>
          <div className="about-photo-badges">
            <div className="about-photo-tag">
              <span className="about-photo-tag-dot" />
              Disponible
            </div>
            <div className="about-photo-location">📍 Saint-Genis-Pouilly</div>
          </div>
        </div>

        {/* ── Colonne 2 : Bio + stats ── */}
        <div className="about-main reveal-up" ref={mainRef}>
          <div className="section-label">À propos</div>
          <h2 className="about-title">
            Bonjour,
            <br />
            je suis <em>Kevin</em>
          </h2>
          <p className="about-role">Fondateur & Développeur · Supaco Digital</p>
          <p className="about-bio">
            Supaco Digital, c'est une agence web indépendante basée à
            Saint-Genis-Pouilly dans le Pays de Gex, créée pour aider les{" "}
            <mark className="about-mark">
              PME locales, indépendants et restaurateurs
            </mark>{" "}
            à <mark className="about-mark">gagner plus de clients</mark> grâce à
            des sites performants.
            <br />
            <br />
            Pas de template générique. Chaque projet est conçu{" "}
            <mark className="about-mark">sur mesure</mark>, avec du code propre
            et une obsession pour les{" "}
            <mark className="about-mark">résultats concrets</mark> — plus de
            visibilité, plus de contacts, plus de ventes.
          </p>

          {/* Stats */}
          <div className="about-stats" ref={statsRef}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`about-stat${
                  animated ? " about-stat--animated" : ""
                }`}
                style={{ "--delay": `${i * 80}ms` }}
              >
                <div className="about-stat-value">
                  {vals[i]}
                  <span className="about-stat-suffix">{s.suffix}</span>
                </div>
                <div className="about-stat-label">{s.label}</div>
                <div className="about-stat-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne 3 : Valeurs + stack ── */}
        <div className="about-aside reveal-right" ref={asideRef}>
          {/* Valeurs différenciantes */}
          <div className="about-aside-label">Ce qui nous différencie</div>
          <div className="about-valeurs">
            {VALEURS.map((v) => (
              <div key={v.titre} className="about-valeur">
                <span className="about-valeur-icon">{v.icon}</span>
                <div>
                  <div className="about-valeur-titre">{v.titre}</div>
                  <div className="about-valeur-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="about-sep" />

          {/* Stack */}
          <div className="about-aside-label">Stack</div>
          <div className="about-pills">
            {STACK.map((s) => (
              <span key={s} className="about-pill">
                {s}
              </span>
            ))}
          </div>

          <div className="about-sep" />

          {/* Socials */}
          <div className="about-aside-label">Contact</div>
          <div className="about-socials">
            <a
              href="https://www.instagram.com/supacodigital/"
              target="_blank"
              rel="noreferrer"
              className="about-social-link"
            >
              <Icon.Instagram />
              <span>@supacodigital</span>
            </a>
            <a
              href="mailto:contact@supaco-digital.com"
              className="about-social-link"
            >
              <Icon.Mail />
              <span>contact@supaco-digital.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
