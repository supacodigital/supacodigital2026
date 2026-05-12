import { useState } from "react";
import { Icon } from "../icons";
import LightBg from "./LightBg";
import CaseStudyModal from "./CaseStudyModal";
import { trackEvent } from "../useAnalytics";

const projects = [
  {
    num: "01",
    name: "Kekosan",
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
    tags: ["Portfolio"],
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
];

export default function Projects() {
  const [active, setActive] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [caseStudy, setCaseStudy] = useState(null);

  const toggle = (i) => setActive(active === i ? null : i);
  const visible = showAll ? projects : projects.slice(0, 3);
  const INITIAL = 3;

  return (
    <section className="section projects" id="projets">
      <LightBg variant="a" />
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

      <div className="proj-list">
        {visible.map((p, i) => {
          const isOpen = active === i;
          const isNew = showAll && i >= INITIAL;
          return (
            <div
              key={p.num}
              className={`proj-item${isOpen ? " proj-item--open" : ""}${isNew ? " proj-item--reveal" : ""}`}
              style={isNew ? { '--reveal-delay': `${(i - INITIAL) * 80}ms` } : undefined}
            >
              {/* ── Ligne cliquable ── */}
              <button
                className="proj-row"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
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
              </button>

              {/* ── Contenu expandable ── */}
              <div className="proj-panel">
                <div className="proj-panel-inner">
                  {/* Visuel */}
                  <div className="proj-visual">
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="proj-logo"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="proj-placeholder">{p.placeholder}</div>
                    )}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-visual-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir le site <Icon.Arrow />
                    </a>
                  </div>
                  {/* Infos */}
                  <div className="proj-details">
                    <div className="proj-details-tags">
                      {p.tags.map((t) => (
                        <span key={t} className="proj-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="proj-details-name">{p.name}</h3>
                    <p className="proj-details-desc">{p.desc}</p>
                    <div className="proj-details-actions">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="proj-details-cta"
                        onClick={() => trackEvent('project_site_click', { project: p.name })}
                      >
                        <span>Voir le site</span>
                        <Icon.Arrow />
                      </a>
                      <button
                        className="proj-details-cs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCaseStudy(p);
                          trackEvent('project_click', { project: p.name });
                        }}
                      >
                        <span>Case study</span>
                        <Icon.Arrow />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="proj-show-more"
        onClick={() => {
          setShowAll((s) => !s);
          setActive(null);
        }}
      >
        <span>
          {showAll
            ? "Voir moins"
            : `Voir les ${projects.length - 3} autres projets`}
        </span>
        <span
          className={`proj-show-more-arrow${
            showAll ? " proj-show-more-arrow--up" : ""
          }`}
        >
          <Icon.Arrow />
        </span>
      </button>

      {caseStudy && (
        <CaseStudyModal
          project={caseStudy}
          onClose={() => setCaseStudy(null)}
        />
      )}
    </section>
  );
}
