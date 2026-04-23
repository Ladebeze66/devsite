"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentSection from "../../../components/ContentSection";
import { getApiUrl } from "../../../utils/getApiUrl";

/**
 * Page détail d'une réalisation liée à une compétence.
 *
 * Route : `/competences/[slug]/[realisation]`
 *   - `slug`        : slug de la compétence parente (ex. `ia`).
 *   - `realisation` : slug de la réalisation (ex. `grasbot`, `newsletter-ia`…).
 *
 * Rendu : on réutilise intégralement `ContentSection` (même carousel Swiper,
 * même prose Markdown Newsreader, même CTA jewel, même skeleton, même état
 * 404) avec la collection Strapi `realisation-ias` et un bouton retour qui
 * renvoie vers la page vignettes de la compétence parente plutôt que vers le
 * portfolio.
 *
 * Le nom exact de la compétence parente est fetché pour personnaliser le
 * kicker (ex. *"Réalisation · Mon exploration et maîtrise de l'IA"*). Si le
 * fetch échoue, on tombe silencieusement sur un libellé générique
 * *"Réalisation · Compétence"*.
 */
export default function RealisationDetailPage() {
  const params = useParams();
  const competenceSlug =
    typeof params?.slug === "string" ? params.slug : null;
  const realisationSlug =
    typeof params?.realisation === "string" ? params.realisation : null;

  const [competenceName, setCompetenceName] = useState<string | null>(null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (!competenceSlug) return;

    let cancelled = false;

    async function fetchCompetenceName() {
      try {
        const res = await fetch(
          `${apiUrl}/api/competences?filters[slug][$eq]=${encodeURIComponent(
            competenceSlug!
          )}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const name: string | undefined = data?.data?.[0]?.name;
        if (!cancelled && name) {
          setCompetenceName(name);
        }
      } catch {
        // silencieux : le kicker restera générique
      }
    }

    fetchCompetenceName();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, competenceSlug]);

  if (!competenceSlug || !realisationSlug) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-on-surface-variant">
        <p className="font-body italic">⏳ Chargement...</p>
      </div>
    );
  }

  const backHref = `/competences/${competenceSlug}`;
  const kickerLabel = competenceName
    ? `Réalisation · ${competenceName}`
    : "Réalisation · Compétence";

  return (
    <ContentSection
      collection="realisation-ias"
      slug={realisationSlug}
      backHref={backHref}
      backLabel="Réalisations"
      kickerLabel={kickerLabel}
      notFoundLabel="Cette réalisation est introuvable."
    />
  );
}
