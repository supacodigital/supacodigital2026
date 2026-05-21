import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "../icons";
import { useGoToContact } from "../useGoToContact";

const NAV_ITEMS = [
  { label: "Services", href: "#services" }, // ancre (home)
  { label: "Projets", href: "#projets" },
  { label: "Contact", href: "#contact" },
  { label: "À propos", to: "/a-propos" }, // page dédiée
];

const SECTION_IDS = [
  "accueil",
  "services",
  "projets",
  "faq",
  "contact",
];

export default function Navbar({ intro = "done" }) {
  const goToContact = useGoToContact();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const lastY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const onHome = location.pathname === "/";

  // Clic sur une ancre (#services…). Sur la home : useAnchorScroll gère le
  // scroll (lien <a href="#..."> intercepté globalement). Hors home : on
  // navigue vers / en passant l'ancre cible, Home scrollera au montage.
  const handleAnchorClick = (e, href) => {
    setMenuOpen(false);
    if (onHome) return;
    e.preventDefault();
    navigate("/", { state: { scrollTo: href.slice(1) } });
  };

  // ── Indicateur glissant (pill highlight) ──
  const listRef = useRef(null);
  const itemRefs = useRef({});
  const [hovered, setHovered] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  // Positionne l'indicateur sous un href donné (ou le masque si null)
  const moveIndicator = (href) => {
    const el = href ? itemRefs.current[href] : null;
    const list = listRef.current;
    if (!el || !list) {
      setIndicator((i) => ({ ...i, opacity: 0 }));
      return;
    }
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setIndicator({
      left: elRect.left - listRect.left,
      width: elRect.width,
      opacity: 1,
    });
  };

  // Cible de l'indicateur : lien survolé, sinon section active
  const indicatorTarget =
    hovered ?? (activeSection ? `#${activeSection}` : null);

  useEffect(() => {
    moveIndicator(indicatorTarget);
    // recalcule au resize (largeurs de liens changeantes)
    const onResize = () => moveIndicator(indicatorTarget);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [indicatorTarget]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 80) {
        setVisible(true);
      } else {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Bloque le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const mobileMenu =
    menuOpen &&
    createPortal(
      <div className="nav-mobile" role="dialog" aria-label="Menu de navigation">
        <div className="nav-mobile-header">
          <a
            href="/"
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              navigate("/");
            }}
            aria-label="Supaco Digital"
          >
            <img
              src="/logo2026.webp"
              alt="Supaco Digital"
              width="32"
              height="32"
            />
          </a>
          <button
            className="nav-mobile-close"
            aria-label="Fermer le menu"
            onClick={closeMenu}
          >
            <Icon.XMark />
          </button>
        </div>
        <ul role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.to ? (
                <a
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    navigate(item.to);
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <button
          className="nav-cta"
          onClick={() => {
            closeMenu();
            goToContact();
          }}
        >
          Prendre RDV
        </button>
      </div>,
      document.body
    );

  return (
    <>
      <div
        className={`nav-wrap nav-wrap--intro-${intro}${
          scrolled ? " scrolled" : ""
        }${!visible && intro === "done" ? " nav-wrap--hidden" : ""}`}
      >
        <nav className="nav" aria-label="Navigation principale">
          <a
            href="/"
            className="nav-logo"
            aria-label="Supaco Digital — retour accueil"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              onHome
                ? window.scrollTo({ top: 0, behavior: "smooth" })
                : navigate("/");
            }}
          >
            <img
              src="/logo2026.webp"
              alt="Supaco Digital"
              fetchPriority="high"
              decoding="async"
              width="34"
              height="34"
            />
          </a>

          <ul
            className="nav-links"
            role="list"
            ref={listRef}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
                opacity: indicator.opacity,
              }}
            />
            {NAV_ITEMS.map((item) => {
              const key = item.to || item.href;
              const isActive = item.to
                ? location.pathname === item.to
                : onHome && activeSection === item.href.replace("#", "");
              return (
                <li key={item.label}>
                  {item.to ? (
                    <a
                      href={item.to}
                      ref={(el) => {
                        itemRefs.current[key] = el;
                      }}
                      className={isActive ? "nav-link--active" : ""}
                      aria-current={isActive ? "page" : undefined}
                      onMouseEnter={() => setHovered(key)}
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        navigate(item.to);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <a
                      href={item.href}
                      ref={(el) => {
                        itemRefs.current[key] = el;
                      }}
                      className={isActive ? "nav-link--active" : ""}
                      aria-current={isActive ? "true" : undefined}
                      onMouseEnter={() => setHovered(key)}
                      onClick={(e) => handleAnchorClick(e, item.href)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <button onClick={() => goToContact()} className="nav-cta">
            Prendre RDV
          </button>

          <button
            className="nav-burger"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <Icon.XMark /> : <Icon.Burger />}
          </button>
        </nav>
      </div>

      {mobileMenu}
    </>
  );
}
