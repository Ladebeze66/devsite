"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl } from "../../utils/getApiUrl";
import { pickStrapiImage, type StrapiMediaLike } from "../../utils/strapiImage";
import VignetteCarousel from "../../components/VignetteCarousel";
import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

/**
 * Page détail d'une compétence — double rendu selon le contenu Strapi.
 *
 * Cas 1 — la compétence est liée à une ou plusieurs `realisation-ia` :
 *   on affiche une **grille de vignettes** alignée sur le pattern éditorial
 *   de `app/portfolio/page.jsx` (grille asymétrique 2/3 + 1/3 alternée). Chaque
 *   vignette est cliquable (lien externe si le champ `link` de la réalisation
 *   est renseigné, sinon lien interne vers la future page détail
 *   `/competences/[slug]/[realisation]` — pour l'instant 404 tant que cette
 *   route n'est pas ajoutée, ce qui est attendu pour l'étape de test du listing).
 *
 * Cas 2 — aucune réalisation liée :
 *   on conserve le rendu historique `ContentSectionCompetencesContainer` qui
 *   affiche le `content` richtext de la compétence. Les compétences Web / 3D
 *   restent donc strictement inchangées tant qu'on ne leur associe pas de
 *   réalisation côté Strapi.
 *
 * Endpoint Strapi utilisé : `/api/realisation-ias` (pluralName par défaut
 * Strapi 5 pour un singularName `realisation-ia`). Filtre sur le slug de la
 * compétence parente via la relation `competences` (many-to-many d'après
 * le content-type créé côté admin).
 */
const spanPattern = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

type Realisation = {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  link?: string;
  order?: number;
  picture?: Array<StrapiMediaLike & { name?: string }>;
};

type Competence = {
  id: number;
  name?: string;
  slug?: string;
  content?: string;
};

export default function CompetencePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : null;

  const [competence, setCompetence] = useState<Competence | null>(null);
  const [realisations, setRealisations] = useState<Realisation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);

      try {
        // 1. Compétence parente (pour le titre de la page vignettes).
        const resCompet = await fetch(
          `${apiUrl}/api/competences?filters[slug][$eq]=${encodeURIComponent(
            slug!
          )}&populate=*`
        );
        const dataCompet = resCompet.ok ? await resCompet.json() : null;
        const fetchedCompetence: Competence | null =
          dataCompet?.data?.[0] ?? null;

        // 2. Réalisations IA liées à cette compétence.
        //    Si l'endpoint n'existe pas encore côté Strapi (404), on bascule
        //    silencieusement sur le rendu historique au lieu de crasher.
        let fetchedRealisations: Realisation[] = [];
        const resReal = await fetch(
          `${apiUrl}/api/realisation-ias?filters[competences][slug][$eq]=${encodeURIComponent(
            slug!
          )}&populate=picture&sort=order:asc`
        );
        if (resReal.ok) {
          const dataReal = await resReal.json();
          fetchedRealisations = (dataReal?.data ?? []).sort(
            (a: Realisation, b: Realisation) =>
              (a.order ?? 999) - (b.order ?? 999)
          );
        } else if (resReal.status !== 404) {
          // 404 = content-type absent, cas légitime → on log seulement les
          // vraies erreurs HTTP (500, 403, etc.).
          console.warn(
            `⚠️ [competences/${slug}] realisation-ias HTTP ${resReal.status}`
          );
        }

        if (!cancelled) {
          setCompetence(fetchedCompetence);
          setRealisations(fetchedRealisations);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ [competences/[slug]] Erreur fetch :", err);
          setRealisations([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, slug]);

  if (!slug) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-on-surface-variant">
        <p className="font-body italic">⏳ Chargement...</p>
      </div>
    );
  }

  // Squelette commun pendant le premier fetch (avant de savoir s'il y a des vignettes ou pas).
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-4 pb-10 sm:px-6">
        <section className="rounded-sheet bg-surface-container-lowest/60 p-6 shadow-ambient-sm backdrop-blur-vellum sm:p-8">
          <div className="h-3 w-24 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-4 h-8 w-2/3 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-surface-container-low/60" />
        </section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={`${spanPattern[idx % spanPattern.length]} rounded-sheet bg-surface-container-lowest/60 p-5 shadow-ambient-sm backdrop-blur-vellum`}
            >
              <div className="aspect-[4/3] w-full animate-pulse rounded-tile bg-surface-container-low/80" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-surface-container-low/80" />
              <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-surface-container-low/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pas de réalisations associées → rendu historique (toutes les compétences hors IA).
  if (!realisations || realisations.length === 0) {
    return (
      <ContentSectionCompetencesContainer collection="competences" slug={slug} />
    );
  }

  // Rendu vignettes.
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-4 pb-10 sm:px-6">
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="realisations-title"
      >
        <div className="flex flex-col gap-3 text-center md:text-left">
          <Link
            href="/competences"
            className="inline-flex items-center gap-1.5 self-center font-headline text-xs font-bold uppercase tracking-[0.3em] text-primary transition hover:text-primary/80 md:self-start"
          >
            <span
              className="material-symbols-outlined text-lg"
              aria-hidden="true"
              translate="no"
            >
              arrow_back
            </span>
            Retour aux compétences
          </Link>
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Compétence · Réalisations
          </span>
          <h1
            id="realisations-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl lg:text-5xl"
          >
            {competence?.name ?? "Compétence"}
          </h1>
          <p className="font-body text-on-surface-variant sm:text-lg">
            Une sélection de réalisations qui illustrent cette compétence en
            contexte — ouvrez une vignette pour en voir le détail.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
        {realisations.map((realisation, idx) => {
          const pictures = realisation.picture ?? [];
          const images = pictures
            .map((img) => {
              const picked = pickStrapiImage(apiUrl, img, "card");
              const url = picked?.src ?? (img?.url ? `${apiUrl}${img.url}` : null);
              if (!url) return null;
              return {
                url,
                alt: img?.name || `Visuel de la réalisation ${realisation.name}`,
              };
            })
            .filter(Boolean);
          const firstImage = images[0];

          // Comportement voulu : la vignette renvoie TOUJOURS vers la fiche
          // détail interne (`/competences/[slug]/[realisation]`). Le lien
          // externe `realisation.link` est exposé en tant que CTA jewel en bas
          // de la fiche détail par `ContentSection`, pas en court-circuit
          // depuis la vignette. Cohérent avec le comportement des fiches
          // `project` du portfolio.
          const href = realisation.slug
            ? `/competences/${slug}/${realisation.slug}`
            : "#";

          return (
            <Link
              key={realisation.id}
              href={href}
              className={`${spanPattern[idx % spanPattern.length]} group flex flex-col overflow-hidden rounded-sheet bg-surface-container-lowest/85 shadow-ambient backdrop-blur-vellum transition duration-300 hover:-translate-y-0.5 hover:shadow-jewel focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-low">
                {images.length > 1 ? (
                  <VignetteCarousel images={images} />
                ) : firstImage ? (
                  <Image
                    src={firstImage.url}
                    alt={firstImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-on-surface-variant">
                    <span
                      className="material-symbols-outlined text-3xl"
                      aria-hidden="true"
                      translate="no"
                    >
                      image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                <span className="font-headline text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                  Réalisation
                </span>
                <h2 className="font-headline text-xl font-extrabold leading-tight tracking-tight text-primary">
                  {realisation.name}
                </h2>
                {realisation.description && (
                  <p className="font-body line-clamp-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                    {realisation.description}
                  </p>
                )}

                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Découvrir
                  <span
                    className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                    translate="no"
                  >
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
