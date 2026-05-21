import { Icon } from "../icons";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "../useReveal";

const STATS = [
  { value: 20, suffix: "+", label: "Projets livrés" },
  { value: 7, suffix: "j", label: "Délai moyen" },
  { value: 100, suffix: "%", label: "Sur mesure" },
  { value: 5, suffix: "★", label: "Note Google" },
];

const VALEURS = [
  {
    icon: Icon.Zap,
    titre: "Livraison rapide",
    desc: "Un site vitrine en 7 jours, une app en 2-3 semaines. Pas de délais à rallonge.",
  },
  {
    icon: Icon.Target,
    titre: "Orienté résultats",
    desc: "L'objectif n'est pas un beau site — c'est plus de clients et plus de ventes.",
  },
  {
    icon: Icon.User,
    titre: "Interlocuteur unique",
    desc: "Kevin de A à Z. Pas de sous-traitant, pas de chaîne de mails. Un contact direct.",
  },
];

const STACK = ["React", "Node.js", "MySql", "SEO natif"];

export default function About() {
  const statsRef = useRef(null);
  const [vals, setVals] = useState(STATS.map(() => 0));
  const [animated, setAnimated] = useState(false);

  const gridRef = useReveal(0.08);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setAnimated(true);
        const duration = 1600;
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
      <div className="about-head">
        <div className="section-label">À propos</div>
        <h2 className="about-title">
          Bonjour, je suis <em>Kevin</em>
        </h2>
      </div>

      <div className="about-bento reveal-stagger" ref={gridRef}>
        {/* Carte photo (haute, à gauche) */}
        <article className="bento-card bento-photo">
          <img
            src="/kevin.webp"
            alt="Kevin — fondateur de Supaco Digital"
            className="bento-photo-img"
            loading="lazy"
            decoding="async"
            width="320"
            height="400"
          />
          <div className="bento-photo-overlay">
            <span className="bento-photo-dot" />
            Disponible · Saint-Genis-Pouilly
          </div>
        </article>

        {/* Carte bio (large) */}
        <article className="bento-card bento-bio">
          <p className="bento-role">Fondateur &amp; Développeur</p>
          <p className="bento-bio-text">
            Supaco Digital, c'est une agence web indépendante du{" "}
            <strong>Pays de Gex</strong>, créée pour aider les PME, indépendants
            et restaurateurs à <strong>gagner plus de clients</strong> grâce à
            des sites performants. Pas de template générique : chaque projet est
            conçu <strong>sur mesure</strong>, avec du code propre et une
            obsession pour les résultats concrets.
          </p>
        </article>

        {/* Cartes stats */}
        <div className="bento-stats" ref={statsRef}>
          {STATS.map((s, i) => (
            <article
              key={s.label}
              className={`bento-card bento-stat${
                animated ? " is-animated" : ""
              }`}
              style={{ "--delay": `${i * 70}ms` }}
            >
              <div className="bento-stat-value">
                {vals[i]}
                <span className="bento-stat-suffix">{s.suffix}</span>
              </div>
              <div className="bento-stat-label">{s.label}</div>
            </article>
          ))}
        </div>

        {/* Cartes valeurs */}
        {VALEURS.map((v) => {
          const Ico = v.icon;
          return (
            <article key={v.titre} className="bento-card bento-valeur">
              <span className="bento-valeur-icon">
                <Ico />
              </span>
              <div className="bento-valeur-titre">{v.titre}</div>
              <p className="bento-valeur-desc">{v.desc}</p>
            </article>
          );
        })}

        {/* Carte stack + contact (large, en pied) */}
        <article className="bento-card bento-footer">
          <div className="bento-footer-block">
            <div className="bento-footer-label">Stack technique</div>
            <div className="bento-pills">
              {STACK.map((s) => (
                <span key={s} className="bento-pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="bento-footer-block">
            <div className="bento-footer-label">Contact direct</div>
            <div className="bento-socials">
              <a
                href="https://www.instagram.com/supacodigital/"
                target="_blank"
                rel="noreferrer"
                className="bento-social"
              >
                <Icon.Instagram />
                <span>@supacodigital</span>
              </a>
              <a
                href="mailto:contact@supaco-digital.com"
                className="bento-social"
              >
                <Icon.Mail />
                <span>contact@supaco-digital.com</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
