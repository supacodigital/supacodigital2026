import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LegalModal from "./LegalModal";
import { Icon } from "../icons";

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Projets", href: "#projets" },
  { label: "Avis", href: "#avis" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "À propos", href: "/a-propos" },
];

const SERVICES_LINKS = [
  { label: "Site vitrine", href: "#services" },
  { label: "Site Pro", href: "#services" },
  { label: "Boutique E-Commerce", href: "#services" },
  { label: "Application sur mesure", href: "#services" },
  { label: "App Restaurant", href: "#services" },
];

const ZONES = [
  "Saint-Genis-Pouilly",
  "Gex",
  "Ferney-Voltaire",
  "Divonne-les-Bains",
  "Thoiry",
  "Prévessin-Moëns",
];

export default function Footer() {
  const [legal, setLegal] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";

  // Clic sur un lien interne. Ancre (#id) : sur la home, useAnchorScroll
  // intercepte et scrolle ; hors home, on navigue vers / avec la section
  // cible (Home scrolle au montage). Lien de page (/x) : navigation normale.
  const handleClick = (e, href) => {
    if (href.startsWith("#")) {
      if (onHome) return; // useAnchorScroll gère le scroll
      e.preventDefault();
      navigate("/", { state: { scrollTo: href.slice(1) } });
    } else {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <>
      <footer className="footer">
        {/* ── Grille principale ── */}
        <div className="footer-grid">
          {/* Col 1 : Logo + description + socials */}
          <div className="footer-brand">
            <a href="#accueil" className="footer-logo" onClick={(e) => handleClick(e, "#accueil")}>
              <img
                src="/logo2026.webp"
                alt="Supaco Digital"
                width="28"
                height="28"
                loading="lazy"
              />
              <span className="footer-logo-text">
                Supaco<span>.</span>Digital
              </span>
            </a>
            <p className="footer-desc">
              Agence web freelance à Saint-Genis-Pouilly, Pays de Gex. Sites
              vitrines, e-commerce et apps web sur mesure pour PME et
              indépendants.
            </p>

            {/* Badge Google */}
            <a
              href="https://share.google/m3klfZOEmhom152fk"
              target="_blank"
              rel="noreferrer"
              className="footer-google-badge"
              aria-label="Voir les avis Google — Note 5/5"
            >
              <svg
                className="footer-google-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <div className="footer-google-info">
                <div
                  className="footer-google-stars"
                  aria-label="5 étoiles sur 5"
                >
                  {"★★★★★"}
                </div>
                <div className="footer-google-text">
                  <span className="footer-google-score">5.0</span>
                  <span className="footer-google-count">· 5 avis Google</span>
                </div>
              </div>
            </a>

            {/* Socials */}
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/supacodigital/"
                target="_blank"
                rel="noreferrer"
                className="footer-social"
                aria-label="Instagram Supaco Digital"
              >
                <Icon.Instagram />
              </a>
              <a
                href="mailto:contact@supaco-digital.com"
                className="footer-social"
                aria-label="Envoyer un email"
              >
                <Icon.Mail />
              </a>
            </div>
          </div>

          {/* Col 2 : Navigation */}
          <div className="footer-col">
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-col-links" role="list">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => handleClick(e, l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 : Services */}
          <div className="footer-col">
            <div className="footer-col-title">Services</div>
            <ul className="footer-col-links" role="list">
              {SERVICES_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => handleClick(e, l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 : Contact + horaires + zones */}
          <div className="footer-col">
            <div className="footer-col-title">Contact</div>
            <ul className="footer-contact-list" role="list">
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  ✉
                </span>
                <a href="mailto:contact@supaco-digital.com">
                  contact@supaco-digital.com
                </a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  📍
                </span>
                <span>Saint-Genis-Pouilly, 01630</span>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  🕐
                </span>
                <span>Lun–Ven · 9h–18h</span>
              </li>
            </ul>

            <div className="footer-col-title" style={{ marginTop: "24px" }}>
              Zone d'intervention
            </div>
            <div className="footer-zones">
              {ZONES.map((z) => (
                <span key={z} className="footer-zone-pill">
                  {z}
                </span>
              ))}
              <span className="footer-zone-pill footer-zone-pill--more">
                + France entière
              </span>
            </div>
          </div>
        </div>

        {/* ── Bas de footer ── */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 <span>Supaco Digital</span> — Agence web Pays de Gex
          </div>
          <ul className="footer-legal" role="list">
            <li>
              <button onClick={() => setLegal("mentions")}>
                Mentions légales
              </button>
            </li>
            <li>
              <button onClick={() => setLegal("privacy")}>
                Confidentialité
              </button>
            </li>
          </ul>
        </div>
      </footer>

      {legal && <LegalModal type={legal} onClose={() => setLegal(null)} />}
    </>
  );
}
