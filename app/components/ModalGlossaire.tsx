"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import CarouselCompetences from "./CarouselCompetences";
import { getApiUrl } from "../utils/getApiUrl";

interface ImageData {
  url: string;
  name?: string;
  formats?: {
    large?: {
      url: string;
    };
  };
}

interface GlossaireMot {
  mot_clef: string;
  description: string;
  images?: ImageData[];
}

interface ModalGlossaireProps {
  mot: GlossaireMot;
  onClose: () => void;
}

export default function ModalGlossaire({ mot, onClose }: ModalGlossaireProps) {
  const apiUrl = getApiUrl();

  // Verrouille le scroll du body + ferme sur Esc.
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const images =
    mot.images?.map((img) => ({
      url: `${apiUrl}${img.formats?.large?.url || img.url}`,
      alt: img.name || "Illustration",
    })) || [];

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-on-surface/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Glossaire : ${mot.mot_clef}`}
      onClick={onClose}
    >
      {/* Carte interne : largeur fluide avec marge, hauteur capée, scroll interne si besoin.
          stopPropagation pour ne pas fermer la modale quand on interagit à l'intérieur. */}
      <div
        className="relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-sheet bg-surface-container-lowest/95 backdrop-blur-vellum p-6 shadow-ambient"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={onClose}
          aria-label="Fermer la fenêtre du glossaire"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>

        <div className="flex flex-col md:flex-row gap-6 overflow-y-auto pr-1">
          <div className="md:w-1/2">
            <h2 className="mb-4 pr-10 text-2xl font-headline font-extrabold tracking-tight text-primary md:text-3xl">
              {mot.mot_clef}
            </h2>
            <p className="font-body text-base leading-relaxed text-on-surface-variant">
              {mot.description}
            </p>
          </div>

          <div className="md:w-1/2 min-h-[200px] md:min-h-[320px]">
            {images.length > 0 ? (
              <CarouselCompetences images={images} className="h-full w-full" />
            ) : (
              <p className="text-sm text-on-surface-variant italic">
                Aucune image disponible.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
