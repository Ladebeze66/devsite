"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getApiUrl } from "../utils/getApiUrl";
import { pickStrapiImage, type StrapiMediaLike } from "../utils/strapiImage";
import CarouselCompetences from "./CarouselCompetences";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ModalGlossaire from "./ModalGlossaire";

interface ImageData extends StrapiMediaLike {
  name?: string;
}

interface CompetenceData {
  name: string;
  content: string;
  picture?: ImageData[];
}

interface GlossaireItem {
  mot_clef: string;
  slug: string;
  variantes: string[];
  description: string;
  images?: ImageData[];
}

interface ContentSectionProps {
  competenceData: CompetenceData | null;
  glossaireData: GlossaireItem[];
  titleClass?: string;
  contentClass?: string;
}

/**
 * Fiche détail compétences — refonte "Digital Atelier" (étape 7.c).
 *
 * Trois changements structurants par rapport à la version pré-refonte :
 *
 * 1. **Style tokenisé** : même gabarit "feuillet de vellum" que le portfolio.
 *    Les classes hardcodées `bg-white/70 text-blue-700 font-headline font-bold`
 *    disparaissent. Le corps éditorial est rendu en `prose` Newsreader, les
 *    titres Markdown en Manrope `text-primary`.
 *
 * 2. **Keywords glossaire & chatbot sans styles inline** : on retire les
 *    `style="color: red/blue; cursor: pointer"` injectés dans le HTML. On
 *    conserve les classes `.keyword` / `.chatbot-keyword` historiques et on
 *    les stylise via `globals.css` avec la palette Stitch (voir `.glossary-keyword`).
 *    Pour rester rétro-compatible avec les classes historiques, `keyword` est
 *    renommée `glossary-keyword` dans la transformation.
 *
 * 3. **Event listeners scopés au wrapper** (ref `contentRef`) plutôt que
 *    `document.body.addEventListener`. Avant : risque de fuite + interaction
 *    avec d'autres parties du DOM. Après : la zone "contenu" capture ses clics
 *    en bubbling, comportement identique mais sans effet de bord global.
 *
 * 4. **Chatbot via FAB global** (étape 7.e) : plus de `<ChatBot />` local dans
 *    cette fiche. Un clic sur "IA locale" dispatch `CustomEvent("grasbot:open")`
 *    que le FAB monté dans `layout.tsx` écoute pour ouvrir le chatbot partagé.
 */
export default function ContentSectionCompetences({
  competenceData,
  glossaireData,
}: ContentSectionProps) {
  const [selectedMot, setSelectedMot] = useState<GlossaireItem | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const apiUrl = getApiUrl();

  // Délégation locale : capte les clics sur les keywords injectés dans le Markdown,
  // sans polluer document.body comme avant la refonte.
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.dataset?.chatbot === "true") {
        window.dispatchEvent(new CustomEvent("grasbot:open"));
        return;
      }

      if (target.classList?.contains("glossary-keyword")) {
        const mot = target.getAttribute("data-mot");
        if (!mot) return;
        const glossaireMot = glossaireData.find((g) => g.mot_clef === mot);
        setSelectedMot(glossaireMot || null);
      }
    };

    node.addEventListener("click", handleClick);
    return () => node.removeEventListener("click", handleClick);
  }, [glossaireData]);

  if (!competenceData) {
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
            Cette compétence est introuvable.
          </p>
          <Link
            href="/competences"
            className="mt-5 inline-flex items-center gap-1.5 font-headline text-sm font-bold uppercase tracking-[0.2em] text-primary hover:underline"
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
        </section>
      </div>
    );
  }

  const { name, content, picture } = competenceData;

  const images =
    picture
      ?.map((img: ImageData) => {
        const picked = pickStrapiImage(apiUrl, img, "full");
        const url =
          picked?.src ??
          (img.url || img.formats?.large?.url
            ? `${apiUrl}${img.formats?.large?.url ?? img.url}`
            : null);
        if (!url) return null;
        return {
          url,
          alt: img.name || `Visuel de la compétence ${name}`,
        };
      })
      .filter((item): item is { url: string; alt: string } => item != null) || [];

  /**
   * Transforme le Markdown en injectant des spans `.glossary-keyword` / `.chatbot-keyword`
   * autour des mots-clés trouvés. Les styles sont définis dans `globals.css`
   * (palette Stitch, soulignement pointillé) plutôt qu'inline dans l'attribut style.
   */
  function transformMarkdownWithKeywords(text: string) {
    if (!text) return "";
    let modifiedText = text;

    modifiedText = modifiedText.replace(
      /\bIA locale\b/g,
      `<span class="chatbot-keyword" data-chatbot="true" role="button" tabindex="0">IA locale</span>`
    );

    if (glossaireData.length) {
      glossaireData.forEach(({ mot_clef, variantes }) => {
        const regexVariants = variantes
          .map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|");
        const regex = new RegExp(`\\b(${mot_clef}|${regexVariants})\\b`, "gi");

        modifiedText = modifiedText.replace(regex, (match) => {
          return `<span class="glossary-keyword" data-mot="${mot_clef}" role="button" tabindex="0">${match}</span>`;
        });
      });
    }

    return modifiedText;
  }

  const contentWithLinks = transformMarkdownWithKeywords(content);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-10 sm:px-6">
      <Link
        href="/competences"
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-lowest/70 px-3 py-1.5 font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-vellum transition-colors hover:bg-surface-container-lowest/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          className="material-symbols-outlined text-base"
          aria-hidden="true"
          translate="no"
        >
          arrow_back
        </span>
        Compétences
      </Link>

      <section
        className="rounded-sheet bg-surface-container-lowest/85 p-5 shadow-ambient backdrop-blur-vellum sm:p-7 md:p-8"
        aria-labelledby="competence-title"
      >
        <div className="flex flex-col gap-3">
          <span className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
            Compétence · Savoir-faire
          </span>
          <h1
            id="competence-title"
            className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl"
          >
            {name}
          </h1>
        </div>

        {images.length > 0 && (
          <div className="mt-5">
            <CarouselCompetences images={images} className="h-64 sm:h-80 md:h-96" />
          </div>
        )}

        <div
          ref={contentRef}
          className="prose prose-sm mt-5 max-w-none font-body text-on-surface-variant sm:prose-base
            prose-headings:font-headline prose-headings:text-primary
            prose-p:font-body prose-p:text-left prose-p:text-on-surface-variant md:prose-p:text-justify
            prose-strong:text-on-surface
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-li:marker:text-primary
            prose-hr:border-0 prose-hr:w-16 prose-hr:mx-auto prose-hr:bg-primary/30 prose-hr:h-0.5 prose-hr:rounded-full prose-hr:my-6"
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{contentWithLinks}</ReactMarkdown>
        </div>
      </section>

      {selectedMot && (
        <ModalGlossaire mot={selectedMot} onClose={() => setSelectedMot(null)} />
      )}
    </div>
  );
}
