/**
 * URL publique pour les pilules « sources » GrasBot (aligné sur `llm-api/search.py`).
 *
 * Ne pas faire confiance à `source.url` seul : l’API ou l’historique localStorage
 * peut contenir d’anciennes URLs (`/competences/ia/grasbot`). On reconstruit
 * toujours à partir de `path_slug` / `site_slug` / fallbacks quand un segment
 * parent Strapi est connu.
 */

/** Slug vault → segment parent dans l’URL */
export const GRASBOT_ROUTE_PARENT_FALLBACK = {
  grasbot: "ia",
  "newsletter-ia": "ia",
  "transcription-video": "ia",
  "transcription-audio-fgc-transcription": "ia",
};

/** Slug vault → dernier segment Strapi / Next (cf. Admin Strapi → realisation-ia) */
export const GRASBOT_SITE_SLUG_FALLBACK = {
  grasbot: "gras-bot-chatbot-ia-du-portfolio",
  "transcription-video": "transcription-video-automatique",
  "newsletter-ia": "newsletter-ia-generation-automatisee-avec-ollama-and-listmonk",
};

/**
 * @param {{
 *   slug?: string,
 *   type?: string,
 *   url?: string,
 *   route_parent?: string,
 *   site_slug?: string,
 *   path_slug?: string,
 * }} source
 * @returns {string}
 */
export function resolveGrasbotSourceHref(source) {
  if (!source?.slug) return "#";

  const vaultSlug = source.slug;

  /* Dernier segment d’URL Strapi : souvent `site_slug`, sinon slug vault.
   * Piège : l’API peut n’exposer que le slug vault (`grasbot`) alors que la page
   * Next/Strapi attend l’UID titre (`gras-bot-chatbot-ia-du-portfolio`). Une
   * compétence comme transcription audio n’a pas ce décalage : path_slug = slug
   * vault = slug Strapi → ça marche. Les projets IA oui : on corrige quand
   * path_slug vaut encore le seul identifiant vault mais un fallback existe. */
  let pathSlug =
    (source.path_slug && String(source.path_slug).trim()) ||
    (source.site_slug && String(source.site_slug).trim()) ||
    vaultSlug;

  const siteSlugMapped = GRASBOT_SITE_SLUG_FALLBACK[vaultSlug];
  if (siteSlugMapped && pathSlug === vaultSlug) {
    pathSlug = siteSlugMapped;
  }

  const parentRaw =
    source.route_parent !== undefined && source.route_parent !== null
      ? String(source.route_parent).trim()
      : "";
  const parent = parentRaw || GRASBOT_ROUTE_PARENT_FALLBACK[vaultSlug] || "";
  /** Route imbriquée /competences/[parent]/[pathSlug] (réalisation IA, compétence sous ia, etc.) */
  const nested = Boolean(parent && parent !== vaultSlug);

  if (nested) {
    return `/competences/${parent}/${pathSlug}`;
  }

  const type = String(source.type || "").toLowerCase();

  if (type === "projet") {
    return `/portfolio/${pathSlug}`;
  }
  if (type === "competence") {
    return `/competences/${pathSlug}`;
  }

  /* moc, parcours, technique, … — garder l’URL serveur si fournie */
  if (typeof source.url === "string" && source.url.startsWith("/")) {
    return source.url;
  }
  return "#";
}

/**
 * Icône Material Symbols pour la pilule : alignée sur l’URL réelle, pas seulement `source.type`.
 * Les réalisations IA sont des `type: projet` dans le vault mais vivent sous `/competences/.../...`
 * (comme une section compétence) : l’ancien test `type === "competence" ? psychology : folder`
 * leur assignait à tort l’icône « dossier » réservée au portfolio.
 *
 * @param {{
 *   slug?: string,
 *   type?: string,
 *   url?: string,
 *   route_parent?: string,
 *   site_slug?: string,
 *   path_slug?: string,
 * }} source
 * @param {string} [resolvedHref] — résultat de `resolveGrasbotSourceHref(source)` pour éviter un double calcul
 * @returns {string} nom d’icône Material Symbols
 */
export function getGrasbotSourceIconName(source, resolvedHref) {
  const href =
    typeof resolvedHref === "string" ? resolvedHref : resolveGrasbotSourceHref(source);

  if (href === "#") return "link";

  if (href.startsWith("/portfolio/")) {
    return "folder";
  }

  if (href.startsWith("/competences/")) {
    const parts = href.split("/").filter(Boolean);
    const nested = parts.length >= 3;

    const type = String(source?.type || "").toLowerCase();

    if (nested) {
      if (type === "competence") {
        return "psychology";
      }
      if (type === "projet") {
        return "deployed_code";
      }
      if (GRASBOT_SITE_SLUG_FALLBACK[source.slug]) {
        return "deployed_code";
      }
      return "psychology";
    }

    return "psychology";
  }

  return "link";
}
