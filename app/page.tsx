"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./assets/main.css";
import { getApiUrl } from "./utils/getApiUrl";

async function getHomepageData() {
  const apiUrl = getApiUrl();

  const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(
        `🔄 [getHomepageData] Tentative ${attempt}/3 - URL: ${apiUrl}/api/homepages?populate=*`
      );

      const response = await fetchWithTimeout(
        `${apiUrl}/api/homepages?populate=*`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ [getHomepageData] Données récupérées avec succès");
      return data.data?.[0] ?? null;
    } catch (error) {
      console.error(`❌ [getHomepageData] Erreur tentative ${attempt}:`, error);

      if (attempt === 3) {
        console.error("🚨 [getHomepageData] Toutes les tentatives ont échoué");
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  return null;
}

/**
 * Trois axes éditoriaux de la home. Contenu hardcodé pour l'instant : simple
 * et modifiable ici. À porter vers un content-type Strapi dédié plus tard si
 * on veut l'éditer sans déploiement.
 */
const takeaways = [
  {
    icon: "psychology",
    title: "Intelligence artificielle",
    body: "Intégration d'IA locale et d'assistants conversationnels en environnement souverain.",
  },
  {
    icon: "terminal",
    title: "Développement web",
    body: "Next.js, Strapi, FastAPI — stack moderne de bout en bout, du CMS à la diffusion.",
  },
  {
    icon: "school",
    title: "École 42",
    body: "Formation par projets, pédagogie par les pairs, progression autodidacte continue.",
  },
];

export default function HomePage() {
  const [homepage, setHomepage] = useState<any>(null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    getHomepageData().then((data) => setHomepage(data));
  }, []);

  if (!homepage) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-md items-center justify-center px-4">
        <p className="font-body italic text-secondary">
          Chargement de la page…
        </p>
      </div>
    );
  }

  const title = homepage.title ?? "Titre par défaut";
  const cv: string = homepage.cv ?? "";
  const imageUrl = homepage.photo?.url ? `${apiUrl}${homepage.photo.url}` : null;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3 px-4 pb-10 sm:px-6">
      {/* Hero "feuillet de vellum" : carte principale à 85 % sur le wallpaper. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="home-title"
      >
        <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
          {/* Portrait avec frame primary (1 px d'air), remplace le cercle historique. */}
          <div className="mx-auto md:mx-0">
            {imageUrl ? (
              <div className="rounded-sheet bg-primary p-1 shadow-ambient-sm">
                <div className="overflow-hidden rounded-[1.25rem]">
                  <img
                    src={imageUrl}
                    alt={`Portrait de ${title}`}
                    className="h-48 w-48 object-cover object-center sm:h-56 sm:w-56 md:h-64 md:w-64"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-sheet bg-surface-container text-sm text-on-surface-variant sm:h-56 sm:w-56 md:h-64 md:w-64">
                Image indisponible
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
              Portfolio · Étudiant 42 Perpignan
            </span>
            <h1
              id="home-title"
              className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl lg:text-5xl"
            >
              {title}
            </h1>

            {cv && (
              <div
                className="prose prose-sm max-w-none font-body text-on-surface-variant sm:prose-base
                prose-headings:font-headline prose-headings:text-primary
                prose-p:font-body prose-p:text-left prose-p:text-on-surface-variant md:prose-p:text-justify
                prose-strong:text-on-surface
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-li:marker:text-primary
                prose-hr:border-0 prose-hr:w-16 prose-hr:mx-auto prose-hr:bg-primary/30 prose-hr:h-0.5 prose-hr:rounded-full prose-hr:my-6"
              >
                <ReactMarkdown>{cv}</ReactMarkdown>
              </div>
            )}

            <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:items-center md:justify-start">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-tile bg-primary px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-jewel transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed"
              >
                Voir mes projets
                <span
                  className="material-symbols-outlined text-base"
                  aria-hidden="true"
                  translate="no"
                >
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-tile px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary-fixed/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Me contacter
                <span
                  className="material-symbols-outlined text-base"
                  aria-hidden="true"
                  translate="no"
                >
                  mail
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trois axes : cartes éditoriales, grille 3 colonnes desktop, stack mobile. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-6"
        aria-labelledby="home-axes"
      >
        <div className="mb-4 text-center md:text-left">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Ce qui m&apos;anime
          </span>
          <h2
            id="home-axes"
            className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-primary md:text-3xl"
          >
            Trois axes de travail
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {takeaways.map((item) => (
            <article
              key={item.title}
              className="rounded-tile bg-surface-container-low/80 p-5 transition-colors hover:bg-surface-container/80"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary">
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  translate="no"
                >
                  {item.icon}
                </span>
              </div>
              <h3 className="mb-1 font-headline text-lg font-bold text-primary">
                {item.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Pull-quote "Démarche" : carte vellum légère (opacité 65 %, sans ombre,
          radius tile) pour rester lisible sur wallpaper sans écraser la variation
          éditoriale voulue par DESIGN.md §5. Barre gauche primaire conservée. */}
      <section
        className="rounded-tile bg-surface-container-lowest/65 p-5 backdrop-blur-vellum sm:p-6"
        aria-labelledby="home-demarche"
      >
        <blockquote className="border-l-4 border-primary pl-5 md:pl-8">
          <span
            id="home-demarche"
            className="mb-2 block font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-primary"
          >
            Démarche
          </span>
          <p className="font-body text-lg italic leading-snug text-on-surface md:text-2xl">
            « Apprendre à construire, puis construire pour apprendre — chaque
            projet est une nouvelle pièce du métier. »
          </p>
          <cite className="mt-3 block font-headline text-sm font-bold not-italic text-secondary">
            — Fernand Gras-Calvet
          </cite>
        </blockquote>
      </section>
    </div>
  );
}
