import { useEffect } from "react";
import Seo from "../components/Seo";
import About from "../components/About";

export default function AboutPage() {
  // Au montage de la page, on remonte en haut
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="about-page">
      <Seo
        title="À propos — Kevin, fondateur de Supaco Digital | Pays de Gex"
        description="Kevin, développeur web indépendant à Saint-Genis-Pouilly. Supaco Digital aide les PME, indépendants et restaurateurs du Pays de Gex à gagner plus de clients avec des sites sur mesure."
        path="/a-propos"
      />
      <About />
    </main>
  );
}
