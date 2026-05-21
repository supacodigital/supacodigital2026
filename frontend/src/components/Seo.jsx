const SITE = "https://supaco.digital";
const OG_IMAGE = `${SITE}/og-image.png`;

/**
 * Métadonnées SEO par page. React 19 hisse automatiquement <title>, <meta>
 * et <link> rendus ici vers le <head> du document.
 *
 * - title       : titre de l'onglet / SERP
 * - description : meta description
 * - path        : chemin de la page (ex: "/", "/a-propos") → canonical + og:url
 * - image       : URL absolue de l'image OG (défaut : og-image du site)
 */
export default function Seo({ title, description, path = "/", image = OG_IMAGE }) {
  const url = `${SITE}${path === "/" ? "/" : path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Supaco Digital" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
