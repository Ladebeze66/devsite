"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";
import { getApiUrl } from "../utils/getApiUrl";
import Carousel from "./Carousel";
import ReactMarkdown from "react-markdown";

interface ImageData {
  url: string;
  formats?: {
    large?: {
      url: string;
    };
  };
  name?: string;
}

interface ContentData {
  name: string;
  Resum: string;
  picture?: ImageData[];
  link?: string;
  linkText?: string;
}

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

/**
 * Fiche détail portfolio — refonte "Digital Atelier" (étape 7.b).
 *
 * Structure : bouton retour + en-tête vellum (kicker + titre Manrope) + carousel
 * détail (Swiper Stitch) + corps Markdown en `prose` Newsreader + CTA jewel
 * optionnel vers le lien externe. Les props `titleClass` / `contentClass`
 * héritées du composant pré-refonte restent acceptées pour compatibilité mais
 * sont ignorées (styles tokenisés désormais) — on les garde dans l'interface
 * pour ne pas casser les consommateurs.
 */
export default function ContentSection({
  collection,
  slug,
}: ContentSectionProps) {
  const [data, setData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchContent() {
      try {
        const result = await fetchData(collection, slug);
        setData(result);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [collection, slug, apiUrl]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-10 sm:px-6">
        <div className="rounded-sheet bg-surface-container-lowest/65 p-6 shadow-ambient-sm backdrop-blur-vellum">
          <div className="h-4 w-24 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-3 h-8 w-3/4 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-5 aspect-[16/9] w-full animate-pulse rounded-tile bg-surface-container-low/80" />
          <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-surface-container-low/60" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-surface-container-low/60" />
          <div className="mt-2 h-4 w-4/6 animate-pulse rounded-full bg-surface-container-low/60" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-10 sm:px-6">
        <section className="rounded-sheet bg-surface-container-lowest/85 p-8 text-center shadow-ambient backdrop-blur-vellum">
          <span
            className="material-symbols-outlined mb-3 text-4xl text-primary"
            aria-hidden="true"
            translate="no"
          >
            search_off
          </span>
          <p className="font-body italic text-on-surface-variant">
            Ce projet est introuvable.
          </p>
          <Link
            href="/portfolio"
            className="mt-5 inline-flex items-center gap-1.5 font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary hover:underline"
          >
            <span
              className="material-symbols-outlined text-lg"
              aria-hidden="true"
              translate="no"
            >
              arrow_back
            </span>
            Retour au portfolio
          </Link>
        </section>
      </div>
    );
  }

  const { name, Resum: richText, picture, link, linkText } = data;

  const images =
    picture?.map((img: ImageData) => ({
      url: `${apiUrl}${img.formats?.large?.url || img.url}`,
      alt: img.name || `Visuel du projet ${name}`,
    })) || [];

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-10 sm:px-6">
      {/* Bouton retour discret, posé sur le wallpaper comme une miette de fil d'Ariane. */}
      <Link
        href="/portfolio"
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-lowest/70 px-3 py-1.5 font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-vellum transition-colors hover:bg-surface-container-lowest/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          className="material-symbols-outlined text-base"
          aria-hidden="true"
          translate="no"
        >
          arrow_back
        </span>
        Portfolio
      </Link>

      {/* En-tête "feuillet de vellum" aligné sur la home et les listes. */}
      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="project-title"
      >
        <div className="flex flex-col gap-3">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Projet · Portfolio
          </span>
          <h1
            id="project-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl"
          >
            {name}
          </h1>
        </div>

        {images.length > 0 && (
          <div className="mt-5">
            <Carousel images={images} className="h-64 sm:h-80 md:h-96" />
          </div>
        )}

        {richText && (
          <div
            className="prose prose-sm mt-5 max-w-none font-body text-on-surface-variant sm:prose-base
              prose-headings:font-headline prose-headings:text-primary
              prose-p:font-body prose-p:text-on-surface-variant
              prose-strong:text-on-surface
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-li:marker:text-primary
              prose-hr:border-0 prose-hr:w-16 prose-hr:mx-auto prose-hr:bg-primary/30 prose-hr:h-0.5 prose-hr:rounded-full prose-hr:my-6"
          >
            <ReactMarkdown>{richText}</ReactMarkdown>
          </div>
        )}

        {link && (
          <div className="mt-6">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-tile bg-primary px-5 py-2.5 font-headline text-sm font-bold uppercase tracking-[0.2em] text-white shadow-jewel transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {linkText || "Voir plus"}
              <span
                className="material-symbols-outlined text-lg"
                aria-hidden="true"
                translate="no"
              >
                open_in_new
              </span>
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
