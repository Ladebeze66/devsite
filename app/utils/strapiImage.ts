/**
 * Sélection d'une variante Strapi (thumbnail / small / medium / large) pour
 * limiter le poids transféré sans sacrifier la qualité affichée.
 */

export type StrapiImagePreset = "card" | "thumbnail" | "hero" | "full";

export interface StrapiFormatEntry {
  url?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface StrapiMediaLike {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: StrapiFormatEntry | null;
    small?: StrapiFormatEntry | null;
    medium?: StrapiFormatEntry | null;
    large?: StrapiFormatEntry | null;
  } | null;
}

function absUrl(apiUrl: string, path: string | null | undefined): string | null {
  if (path == null || path === "") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${apiUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Choisit l’URL + dimensions d’une image média Strapi selon le contexte d’affichage.
 * Retourne null si aucune URL exploitable.
 */
export function pickStrapiImage(
  apiUrl: string,
  media: StrapiMediaLike | null | undefined,
  preset: StrapiImagePreset
): { src: string; width: number; height: number } | null {
  if (!media?.url) return null;

  const f = media.formats;
  let chosen: StrapiFormatEntry | undefined;

  switch (preset) {
    case "thumbnail":
      chosen = f?.thumbnail ?? f?.small ?? undefined;
      break;
    case "card":
      chosen = f?.medium ?? f?.small ?? f?.thumbnail ?? undefined;
      break;
    case "hero":
    case "full":
      chosen = f?.large ?? f?.medium ?? f?.small ?? undefined;
      break;
    default:
      chosen = f?.medium ?? f?.small;
  }

  const relPath = chosen?.url ?? media.url;
  const src = absUrl(apiUrl, relPath);
  if (!src) return null;

  const width = Number(chosen?.width ?? media.width) || 800;
  const height = Number(chosen?.height ?? media.height) || 600;

  return { src, width, height };
}
