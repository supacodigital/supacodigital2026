import { useState, useRef, useEffect } from "react";
import { Icon } from "../icons";
import { trackEvent } from "../useAnalytics";

const projects = [
  {
    num: "01",
    name: "Kekosan",
    thumb: "/projets/kekosan.webp",
    category: "App restaurant",
    tags: ["App restaurant"],
    placeholder: "KK",
    logo: "/logo/logokekosan.webp",
    desc: "Application web pour un restaurant. Commandes en ligne, gestion des menus et interface d'administration sur mesure.",
    url: "https://www.kekosan.com/",
    year: "2026",
    caseStudy: {
      challenge: "Kekosan souhaitait digitaliser entièrement son service de commande pour réduire les appels téléphoniques, limiter les erreurs de commande et proposer un paiement en ligne fluide — sans solution générique type Uber Eats qui prélève des commissions.",
      solution: "Développement d'une application web sur mesure avec React, permettant aux clients de passer commande en ligne, de choisir entre emporter et livraison, et de payer directement. Le gérant dispose d'un dashboard temps réel pour gérer les commandes entrantes, modifier le menu et suivre les statistiques.",
      metrics: [
        { value: "0%", label: "Commission sur ventes" },
        { value: "~7j", label: "Délai de livraison" },
        { value: "100%", label: "Commandes en ligne" },
      ],
      stack: ["React", "Node.js", "Stripe", "Dashboard admin"],
      testimonial: {
        text: "Supaco Digital a livré exactement ce qu'on voulait, dans les délais. Notre système de commande est maintenant 100% autonome.",
        author: "Gérant, Kekosan",
      },
    },
  },
  {
    num: "02",
    name: "MB Patrimoine",
    thumb: "/projets/mbpatrimoine.webp",
    category: "Site vitrine",
    tags: ["Site Vitrine"],
    placeholder: "MB",
    logo: "/logo/mbpatrimoine.webp",
    desc: "Site vitrine pour une conseillère en gestion de patrimoine. Design soigné, formulaire de contact et présentation des services.",
    url: "https://mb-patrimoine-finance.fr/",
    year: "2026",
    caseStudy: {
      challenge: "MB Patrimoine, conseillère indépendante, n'avait aucune présence en ligne. Sa clientèle se construisait uniquement par bouche-à-oreille, limitant fortement sa visibilité et sa crédibilité auprès de nouveaux prospects.",
      solution: "Création d'un site vitrine professionnel au design épuré et rassurant, adapté au secteur financier. Mise en avant des services, des valeurs et d'un formulaire de contact optimisé pour générer des prises de rendez-vous. SEO local ciblé Pays de Gex.",
      metrics: [
        { value: "< 1 sem", label: "Délai de livraison" },
        { value: "100%", label: "Mobile-first" },
        { value: "SEO", label: "Optimisé local" },
      ],
      stack: ["React", "Vite", "CSS sur mesure", "Formulaire sécurisé"],
    },
  },
  {
    num: "03",
    name: "Bellifood",
    thumb: "/projets/bellifood.webp",
    category: "Site vitrine",
    tags: ["Site Vitrine"],
    placeholder: "BF",
    logo: "/logo/belli.logo.webp",
    desc: "Site vitrine pour une entreprise de restauration. Présentation des services, menu et prise de contact.",
    url: "https://bellifood.com/",
    year: "2025",
    caseStudy: {
      challenge: "Bellifood, acteur de la restauration collective, avait besoin d'un site vitrine qui reflète le sérieux et la qualité de ses prestations pour convaincre des décideurs B2B lors de leurs recherches en ligne.",
      solution: "Site vitrine sobre et professionnel avec présentation claire des offres, galerie des réalisations et formulaire de devis. Design adapté à une cible professionnelle avec un accent mis sur la confiance et la clarté des informations.",
      metrics: [
        { value: "B2B", label: "Cible principale" },
        { value: "< 1 sem", label: "Délai de livraison" },
        { value: "100%", label: "Responsive" },
      ],
      stack: ["React", "Vite", "CSS personnalisé"],
    },
  },
  {
    num: "04",
    name: "Sabai Thoiry",
    thumb: "/projets/sabai.webp",
    category: "App restaurant",
    tags: ["App restaurant"],
    placeholder: "ST",
    logo: "/logo/logosabai.webp",
    desc: "Application de commandes en ligne pour un restaurant. Gestion des menus, commandes en temps réel et interface d'administration.",
    url: "https://sabai-thoiry.com/",
    year: "2026",
    caseStudy: {
      challenge: "Le restaurant Sabai à Thoiry voulait proposer la commande en ligne à ses habitués pour réduire l'attente, fluidifier le service du soir et augmenter les commandes à emporter sans dépendre des plateformes tierces coûteuses.",
      solution: "Application complète avec menu interactif, panier, gestion des horaires d'ouverture et paiement en ligne intégré. Interface d'administration permettant au gérant de modifier les plats, les prix et de voir les commandes en temps réel depuis n'importe quel appareil.",
      metrics: [
        { value: "0%", label: "Commission plateforme" },
        { value: "Temps réel", label: "Gestion commandes" },
        { value: "< 2 sem", label: "Délai de livraison" },
      ],
      stack: ["React", "Node.js", "Stripe", "Dashboard temps réel"],
      testimonial: {
        text: "Depuis le lancement, nos commandes à emporter ont clairement augmenté et on ne dépend plus d'aucune plateforme.",
        author: "Gérant, Sabai Thoiry",
      },
    },
  },
  {
    num: "05",
    name: "Dépannage Gémeaux",
    thumb: "/projets/depannage.webp",
    category: "Site vitrine",
    tags: ["Site Vitrine"],
    placeholder: "DG",
    logo: "/logo/depannagegemeaux.svg",
    desc: "Site vitrine pour un service de dépannage. Mise en avant des interventions, zone géographique et formulaire de demande urgente.",
    url: "https://depannage-gemeaux.fr/",
    year: "2025",
    caseStudy: {
      challenge: "Dépannage Gémeaux intervenait localement mais n'apparaissait pas dans les recherches Google pour \"dépannage Pays de Gex\". Tous les appels venaient du bouche-à-oreille, sans visibilité digitale sur une zone pourtant très demandeuse.",
      solution: "Site vitrine orienté conversion et SEO local : présentation des zones d'intervention, numéro d'urgence bien visible, formulaire de demande rapide et optimisation Google My Business. Structure pensée pour apparaître dans les recherches locales urgentes.",
      metrics: [
        { value: "SEO", label: "Local optimisé" },
        { value: "24/7", label: "Contact urgence visible" },
        { value: "< 1 sem", label: "Délai de livraison" },
      ],
      stack: ["React", "Vite", "SEO local", "Google My Business"],
    },
  },
  {
    num: "06",
    name: "Yojeme",
    thumb: "/projets/yojeme.webp",
    category: "Site vitrine",
    tags: ["Site Vitrine"],
    placeholder: "YJ",
    logo: "/logo/yojeme.webp",
    desc: "Site vitrine moderne pour une marque indépendante. Design épuré, identité visuelle forte et expérience utilisateur soignée.",
    url: "https://www.yojeme.fr/",
    year: "2025",
    caseStudy: {
      challenge: "Yojeme, marque indépendante en phase de lancement, avait besoin d'un site qui transmette immédiatement son univers de marque et capte l'attention d'une audience jeune et exigeante, sans budget pour une agence traditionnelle.",
      solution: "Site vitrine au design premium avec animations subtiles, typographie soignée et palette cohérente avec l'identité de la marque. Expérience utilisateur pensée pour le mobile en priorité, avec des temps de chargement optimisés.",
      metrics: [
        { value: "100%", label: "Design sur mesure" },
        { value: "Mobile", label: "First approach" },
        { value: "< 1 sem", label: "Délai de livraison" },
      ],
      stack: ["React", "Framer Motion", "CSS sur mesure"],
    },
  },
  {
    num: "07",
    name: "Photographe",
    thumb: "/projets/photographe.webp",
    category: "Portfolio",
    tags: ["Portfolio"],
    placeholder: "PH",
    desc: "Portfolio en ligne pour un photographe professionnel. Galerie immersive, présentation des prestations et prise de rendez-vous.",
    url: "https://photographe-six.vercel.app/",
    year: "2025",
    caseStudy: {
      challenge: "Un photographe professionnel avait besoin d'un portfolio en ligne qui mette en valeur son travail sans le noyer dans les éléments d'interface — la photo devait rester reine, avec une navigation qui s'efface.",
      solution: "Portfolio minimaliste avec galerie plein écran, navigation clavier et swipe mobile, présentation des différentes prestations (mariage, portrait, corporate) et intégration d'un formulaire de réservation. Chargement progressif des images pour les performances.",
      metrics: [
        { value: "Galerie", label: "Plein écran" },
        { value: "< 1 sem", label: "Délai de livraison" },
        { value: "100%", label: "Responsive" },
      ],
      stack: ["React", "Lazy loading images", "Animations CSS"],
    },
  },
  {
    num: "08",
    name: "Restaurant Lyon",
    thumb: "/projets/restaurant-lyon.webp",
    category: "Site vitrine",
    tags: ["Site Vitrine"],
    placeholder: "RL",
    desc: "Site vitrine pour un restaurant. Présentation de la carte, ambiance du lieu et réservation en ligne.",
    url: "https://restaurant-t.vercel.app/",
    year: "2025",
    caseStudy: {
      challenge: "Démonstration d'un site restaurant avec ambiance forte : montrer qu'un restaurant peut avoir un site moderne et attirant sans recourir à des templates génériques comme TheFork ou LaFourchette.",
      solution: "Site vitrine avec design sombre et chaud, présentation de la carte par catégories, galerie de photos de plats, horaires et bouton de réservation bien visible. Pensé pour convertir les visiteurs mobiles qui cherchent un restaurant le soir même.",
      metrics: [
        { value: "Dark UI", label: "Design ambiance" },
        { value: "Mobile", label: "Optimisé" },
        { value: "< 1 sem", label: "Délai de livraison" },
      ],
      stack: ["React", "CSS animations", "Design sur mesure"],
    },
  },
  {
    num: "09",
    name: "LM Prestige",
    thumb: "/projets/lm-prestige.webp",
    category: "Portfolio",
    tags: ["Portfolio"],
    placeholder: "LM",
    desc: "Plateforme de location de véhicules en ligne. Recherche par dates et lieu de prise en charge, catalogue par catégories et réservation en quelques clics.",
    url: "https://lm-prestige.vercel.app/",
    year: "2026",
    caseStudy: {
      challenge: "LM Prestige, loueur de véhicules dans le Pays de Gex, avait besoin d'une présence en ligne qui permette aux clients de consulter la flotte et de réserver sans passer par le téléphone — tout en valorisant une image premium face aux grandes enseignes de location.",
      solution: "Plateforme web sur mesure avec moteur de recherche par dates et lieu (Gex, Ferney-Voltaire, Divonne, Aéroport de Genève), catalogue filtrable par catégorie (citadine, berline, SUV, utilitaire, premium) et parcours de réservation fluide. Design soigné, animations et mise en avant des tarifs clairs.",
      metrics: [
        { value: "6+", label: "Véhicules en flotte" },
        { value: "7j/7", label: "Réservation en ligne" },
        { value: "< 2 sem", label: "Délai de livraison" },
      ],
      stack: ["React", "Framer Motion", "Réservation en ligne", "CSS sur mesure"],
    },
  },
];

// Pills dynamiques : "Tous" + catégories présentes, dans l'ordre d'apparition
const ALL = "Tous";
const CATEGORIES = [
  ALL,
  ...projects.reduce((acc, p) => {
    if (!acc.includes(p.category)) acc.push(p.category);
    return acc;
  }, []),
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState(ALL);

  // ── Indicateur glissant (repris de la navbar) ──
  const pillsRef = useRef(null);
  const pillRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = pillRefs.current[filter];
    const list = pillsRef.current;
    if (!el || !list) return;
    const move = () => {
      const r = el.getBoundingClientRect();
      const lr = list.getBoundingClientRect();
      setIndicator({ left: r.left - lr.left, width: r.width });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [filter]);

  const selectFilter = (cat) => {
    if (cat === filter) return;
    setFilter(cat);
    setShowAll(false);
  };

  const filtered =
    filter === ALL ? projects : projects.filter((p) => p.category === filter);
  const INITIAL = 3;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL);

  return (
    <section className="section projects" id="projets">
      <div className="proj-header">
        <div>
          <div className="section-label">Réalisations</div>
          <h2 className="section-title">
            Mes <em>projets</em>
          </h2>
        </div>
        <a href="#contact" className="btn-ghost">
          <span>Démarrer le vôtre</span>
          <Icon.Arrow />
        </a>
      </div>

      {/* ── Filtre par catégorie (pill glissante) ── */}
      <div className="proj-filter" role="tablist" aria-label="Filtrer par type de projet" ref={pillsRef}>
        <span
          className="proj-filter-indicator"
          aria-hidden="true"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
          }}
        />
        {CATEGORIES.map((cat) => {
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              ref={(el) => {
                pillRefs.current[cat] = el;
              }}
              className={`proj-filter-pill${isActive ? " proj-filter-pill--active" : ""}`}
              onClick={() => selectFilter(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="proj-list">
        {visible.map((p, i) => {
          // Au changement de filtre : tous les items entrent en cascade.
          // Au "voir plus" : seuls les items au-delà des 3 premiers entrent.
          const revealFrom = showAll ? INITIAL : 0;
          const isNew = i >= revealFrom;
          return (
            <a
              key={`${filter}-${p.num}`}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className={`proj-item proj-row${isNew ? " proj-item--reveal" : ""}`}
              style={isNew ? { '--reveal-delay': `${(i - revealFrom) * 70}ms` } : undefined}
              onClick={() => trackEvent('project_site_click', { project: p.name })}
            >
              <span className="proj-row-thumb" aria-hidden="true">
                {p.thumb ? (
                  <img src={p.thumb} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="proj-row-thumb-ph">{p.placeholder}</span>
                )}
              </span>
              <span className="proj-row-num">{p.num}</span>
              <span className="proj-row-name">{p.name}</span>
              <div className="proj-row-tags">
                {p.tags.map((t) => (
                  <span key={t} className="proj-tag">
                    {t}
                  </span>
                ))}
              </div>
              <span className="proj-row-year">{p.year}</span>
              <span className="proj-row-arrow">
                <Icon.Arrow />
              </span>
            </a>
          );
        })}
      </div>

      {filtered.length > INITIAL && (
        <button
          className="proj-show-more"
          onClick={() => setShowAll((s) => !s)}
        >
          <span>
            {showAll
              ? "Voir moins"
              : `Voir les ${filtered.length - INITIAL} autres projets`}
          </span>
          <span
            className={`proj-show-more-arrow${
              showAll ? " proj-show-more-arrow--up" : ""
            }`}
          >
            <Icon.Arrow />
          </span>
        </button>
      )}
    </section>
  );
}
