"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "../utils/getApiUrl";
import { pickStrapiImage } from "../utils/strapiImage";
import VignetteCarousel from "../components/VignetteCarousel";
import "../globals.css";
import "../assets/main.css";

/**
 * Liste des compétences — refonte "Digital Atelier" (étape 6).
 *
 * Même pattern de grille asymétrique 2/3 + 1/3 que `app/portfolio/page.jsx` pour
 * garder une cohérence visuelle entre les deux rubriques principales. Le
 * `CarouselCompetences` est retiré de la liste (arbitrage REFONTE-VISUELLE.md §2 :
 * carousel réservé aux galeries intra-fiche) : seule la première image est
 * affichée ici, ce qui allège le rendu et clarifie la lecture.
 */
const spanPattern = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

export default function Page() {
  const [competences, setCompetences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchCompetences() {
      try {
        const response = await fetch(`${apiUrl}/api/competences?populate=*`);
        if (!response.ok) {
          throw new Error(`Erreur de récupération des compétences : ${response.statusText}`);
        }

        const data = await response.json();

        // Strapi v4 : `attributes.order` — Strapi v5 (souvent) : `order` à la racine.
        const getOrder = (item) =>
          item?.order ?? item?.attributes?.order ?? 999;

        const sortedCompetences = (data.data ?? []).sort(
          (a, b) => getOrder(a) - getOrder(b)
        );

        setCompetences(sortedCompetences);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des compétences :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompetences();
  }, [apiUrl]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-4 pb-10 sm:px-6">
      {/* En-tête éditorial cohérent avec le portfolio. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="competences-title"
      >
        <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Compétences · Savoir-faire
          </span>
          <h1
            id="competences-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl lg:text-5xl"
          >
            Ce que je sais faire, et comment
          </h1>
          <p className="font-body text-on-surface-variant sm:text-lg">
            Chaque fiche détaille une compétence, son contexte d’apprentissage et des
            exemples concrets — ouvrez une carte pour voir les outils mobilisés et les
            projets associés.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={`${spanPattern[idx % spanPattern.length]} rounded-sheet bg-surface-container-lowest/60 p-5 shadow-ambient-sm backdrop-blur-vellum`}
            >
              <div className="aspect-[4/3] w-full animate-pulse rounded-tile bg-surface-container-low/80" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-surface-container-low/80" />
              <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-surface-container-low/60" />
              <div className="mt-1.5 h-4 w-5/6 animate-pulse rounded-full bg-surface-container-low/60" />
            </div>
          ))}
        </div>
      ) : competences.length === 0 ? (
        <section className="rounded-sheet bg-surface-container-lowest/75 p-8 text-center shadow-ambient-sm backdrop-blur-vellum">
          <span
            className="material-symbols-outlined mb-3 text-4xl text-primary"
            aria-hidden="true"
            translate="no"
          >
            school
          </span>
          <p className="font-body italic text-on-surface-variant">
            Aucune compétence disponible pour le moment.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
          {competences.map((competence, idx) => {
            const pictures = competence.picture ?? [];
            const images = pictures
              .map((img) => {
                const picked = pickStrapiImage(apiUrl, img, "card");
                const url =
                  picked?.src ?? (img.url ? `${apiUrl}${img.url}` : null);
                if (!url) return null;
                return {
                  url,
                  alt: img.name || `Visuel de la compétence ${competence.name}`,
                };
              })
              .filter(Boolean);
            const firstImage = images[0];

            return (
              <Link
                key={competence.id}
                href={`/competences/${competence.slug}`}
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
                    Compétence
                  </span>
                  <h2 className="font-headline text-xl font-extrabold leading-tight tracking-tight text-primary">
                    {competence.name}
                  </h2>
                  {competence.description && (
                    <p className="font-body text-sm leading-relaxed text-on-surface-variant line-clamp-3 sm:text-base">
                      {competence.description}
                    </p>
                  )}

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary">
                    Explorer
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
      )}
    </div>
  );
}
