"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../globals.css";
import "../assets/main.css";

/**
 * Carousel "fiche détail" — refonte Stitch (étape 7.a).
 *
 * Conserve l'API publique (`images`, `className`) pour ne rien casser côté
 * consommateurs (`ContentSection`, `ModalGlossaire`). Changements vs version
 * historique :
 *
 * - Pagination bullets teintée `primary` via surcharge inline des variables
 *   Swiper (pas de pollution `globals.css`, cf. même approche que `VignetteCarousel`).
 * - Flèches Swiper par défaut recolorées `primary` — laissées en chevrons
 *   Swiper pour garder l'empreinte tactile native (le Material Symbol `chevron`
 *   demandait un remplacement complet du markup via slots).
 * - Conteneur en `rounded-tile overflow-hidden shadow-ambient-sm` plutôt que
 *   `rounded-md shadow-md` — cohérence avec les tokens de la refonte.
 * - **Lightbox refaite en Stitch** : voile `bg-on-surface/80 backdrop-blur-sm`
 *   (vs `bg-black/10 backdrop-blur-2xl` qui dépixellisait l'image), image en
 *   `object-contain` (ne déforme plus les photos verticales), bouton close rond
 *   Material Symbol, fermeture Esc + clic voile.
 */
interface CarouselProps {
  images: Array<{ url: string; alt: string }>;
  className?: string;
}

export default function Carousel({ images, className }: CarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    document.body.classList.add("overflow-hidden");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedImage]);

  return (
    <>
      <div
        className={`relative w-full ${className || "h-64"} overflow-hidden rounded-tile shadow-ambient-sm`}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={images.length > 1}
          className={`w-full ${className || "h-64"}`}
          style={
            {
              "--swiper-navigation-color": "#26445d",
              "--swiper-navigation-size": "28px",
              "--swiper-pagination-color": "#26445d",
              "--swiper-pagination-bullet-inactive-color": "#ffffff",
              "--swiper-pagination-bullet-inactive-opacity": "0.6",
              "--swiper-pagination-bullet-size": "8px",
              "--swiper-pagination-bullet-horizontal-gap": "4px",
            } as React.CSSProperties
          }
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="flex h-full items-center justify-center">
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => setSelectedImage(img.url)}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-on-surface/80 p-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image agrandie"
          >
            <div
              className="relative flex max-h-[92vh] max-w-[92vw] items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -right-1 -top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest/95 text-primary shadow-ambient-sm transition-colors hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setSelectedImage(null)}
                aria-label="Fermer l'aperçu"
              >
                <span
                  className="material-symbols-outlined"
                  aria-hidden="true"
                  translate="no"
                >
                  close
                </span>
              </button>
              <img
                src={selectedImage}
                alt="Aperçu en taille réelle"
                className="max-h-[92vh] max-w-[92vw] rounded-sheet object-contain shadow-ambient"
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
