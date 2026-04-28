"use client";

import Image from "next/image";
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
 * Variante du `Carousel` pour les fiches compétences + la modale glossaire.
 * Comportement et style identiques à `Carousel.tsx` (étape 7.a) — les deux
 * composants sont des quasi-doublons historiques, fusionner proprement demande
 * de rationaliser `ContentSection*` et `ModalGlossaire` en même temps : hors
 * scope, on garde la même API et les mêmes styles côte à côte pour l'instant.
 */
interface CarouselProps {
  images: Array<{ url: string; alt: string }>;
  className?: string;
}

export default function CarouselCompetences({ images, className }: CarouselProps) {
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
            <SwiperSlide
              key={index}
              className="relative flex h-full min-h-0 w-full items-center justify-center"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="cursor-zoom-in object-cover transition-transform duration-300 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, min(48rem, 100vw)"
                onClick={() => setSelectedImage(img.url)}
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
