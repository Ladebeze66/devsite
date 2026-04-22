"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../utils/getApiUrl";
import VignetteCarousel from "../components/VignetteCarousel";
import "../assets/main.css";
import "../globals.css";

/**
 * Liste des projets — refonte "Digital Atelier" (étape 6).
 *
 * Règle DESIGN.md §6 "No-Grid-Lock" : on bannit la grille 3 colonnes symétrique.
 * On utilise une grille asymétrique 2/3 + 1/3 alternée par paires, qui crée un
 * rythme éditorial plutôt qu'un catalogue. Arbitrage acté dans REFONTE-VISUELLE.md §2 :
 * le carousel reste réservé aux fiches détail (étape 7) — la liste n'affiche que
 * la première image, ce qui allège le rendu et clarifie la hiérarchie.
 *
 * Pattern de spans (modulo 4 sur desktop 6 colonnes) :
 *   idx 0 → col-span-4 (vedette)
 *   idx 1 → col-span-2
 *   idx 2 → col-span-2
 *   idx 3 → col-span-4
 * → répète l'alternance pour éviter la monotonie sans dépendre du nombre d'items.
 */
const spanPattern = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          `${apiUrl}/api/projects?populate=picture&sort=order:asc`
        );
        if (!response.ok) {
          throw new Error(`Erreur de récupération des projets : ${response.statusText}`);
        }
        const data = await response.json();

        const sortedProjects = (data.data ?? []).sort(
          (a, b) => (a.order || 999) - (b.order || 999)
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des projets :", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [apiUrl]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-4 pb-10 sm:px-6">
      {/* En-tête éditorial, aligné sur le hero de la home (kicker + titre Manrope). */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="portfolio-title"
      >
        <div className="flex flex-col gap-3 text-center md:text-left">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Portfolio · Projets
          </span>
          <h1
            id="portfolio-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl lg:text-5xl"
          >
            Les projets qui m’ont construit
          </h1>
          <p className="font-body text-on-surface-variant sm:text-lg">
            Une sélection de réalisations pédagogiques, personnelles et professionnelles —
            cliquez sur une carte pour en découvrir la genèse, les choix techniques et les
            visuels.
          </p>
        </div>
      </section>

      {/* État de chargement : 4 squelettes qui respectent la grille asymétrique. */}
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
      ) : projects.length === 0 ? (
        <section className="rounded-sheet bg-surface-container-lowest/75 p-8 text-center shadow-ambient-sm backdrop-blur-vellum">
          <span
            className="material-symbols-outlined mb-3 text-4xl text-primary"
            aria-hidden="true"
            translate="no"
          >
            inbox
          </span>
          <p className="font-body italic text-on-surface-variant">
            Aucun projet à afficher pour le moment.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
          {projects.map((project, idx) => {
            const pictures = project.picture ?? [];
            const images = pictures.map((img) => ({
              url: `${apiUrl}${img.url}`,
              alt: img.name || `Visuel du projet ${project.name}`,
            }));
            const firstImage = images[0];

            return (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className={`${spanPattern[idx % spanPattern.length]} group flex flex-col overflow-hidden rounded-sheet bg-surface-container-lowest/85 shadow-ambient backdrop-blur-vellum transition duration-300 hover:-translate-y-0.5 hover:shadow-jewel focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-low">
                  {images.length > 1 ? (
                    <VignetteCarousel images={images} />
                  ) : firstImage ? (
                    <img
                      src={firstImage.url}
                      alt={firstImage.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
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
                    Projet
                  </span>
                  <h2 className="font-headline text-xl font-extrabold leading-tight tracking-tight text-primary">
                    {project.name}
                  </h2>
                  {project.description && (
                    <p className="font-body text-sm leading-relaxed text-on-surface-variant line-clamp-3 sm:text-base">
                      {project.description}
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
      )}
    </div>
  );
}
