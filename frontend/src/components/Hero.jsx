import { Icon } from "../icons";
import { useAnalytics } from "../useAnalytics";
import { useGoToContact } from "../useGoToContact";
import VideoScrub from "./VideoScrub";

export default function Hero() {
  const { trackHeroCTA } = useAnalytics();
  const goToContact = useGoToContact();

  return (
    <section className="hero" id="accueil">
      <VideoScrub
        src="/hero.mp4"
        poster="/hero-poster.jpg"
        scrollHeight="220vh"
        className="hero-scrub"
      >
        {/* Voiles de lisibilité au-dessus de la vidéo */}
        <div className="hero-veil" />
        {/* Voile d'assombrissement piloté pendant l'effet volet (About qui remonte) */}
        <div className="hero-veil-pin" />

        <div className="hero-overlay">
          <h1 className="hero-title">
            <span className="hero-line">
              <span>Votre site web,</span>
            </span>
            <span className="hero-line">
              <span>votre meilleur</span>
            </span>
            <span className="hero-line">
              <span>
                <em>commercial</em>.
              </span>
            </span>
          </h1>

          <p className="hero-desc">
            Sites et applications qui attirent, convainquent et convertissent —
            pour que les PME, indépendants et e-commerces du
            Pays&nbsp;de&nbsp;Gex gagnent de nouveaux clients chaque jour.
          </p>

          <div className="hero-actions">
            <a
              href="#contact"
              className="hero-btn hero-btn--primary"
              onClick={() => trackHeroCTA("demarrer_projet")}
            >
              <span>Démarrer mon projet</span>
              <Icon.Arrow />
            </a>
            <button
              onClick={() => {
                trackHeroCTA("appel_gratuit");
                goToContact();
              }}
              className="hero-btn hero-btn--ghost"
            >
              <span>Appel gratuit 30 min</span>
            </button>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-rating">
              <span className="hero-proof-stars">★★★★★</span>
              <span className="hero-proof-score">5.0</span>
              <span className="hero-proof-src">· 5 avis Google</span>
            </div>
            <span className="hero-proof-sep" />
            <div className="hero-proof-stats">
              <div className="hero-stat">
                <strong>20+</strong> projets livrés
              </div>
              <div className="hero-stat">
                <strong>72h</strong> délai vitrine
              </div>
            </div>
          </div>
        </div>
      </VideoScrub>
    </section>
  );
}
