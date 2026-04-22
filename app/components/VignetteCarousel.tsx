"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/**
 * Carousel allégé réservé aux vignettes des listes (portfolio, compétences).
 *
 * Différences volontaires par rapport à `Carousel.tsx` / `CarouselCompetences.tsx`
 * (qui restent utilisés dans les fiches détail) :
 *
 * - **Pas de flèches de navigation** : chaque vignette est enveloppée d'un
 *   `<Link>` qui capture le clic. Les flèches Swiper créaient une zone de clic
 *   ambiguë (on croit naviguer dans les images, on arrive sur la fiche détail).
 *   L'autoplay + le swipe tactile suffisent à l'échelle d'une vignette.
 * - **Pas de lightbox** (pas de `createPortal`). La lightbox reste la signature
 *   de la fiche détail ; en vignette on ne propose que la navigation vers la fiche.
 * - **Pagination Stitch** : bullets teintés `primary` via des variables CSS
 *   Swiper surchargées en inline, pour éviter de polluer `globals.css` avec un
 *   sélecteur global.
 *
 * Le composant couvre 100 % de son conteneur parent (qui fixe le `aspect-ratio`
 * dans les pages liste), avec `object-cover` sur les images.
 */
interface VignetteCarouselProps {
  images: Array<{ url: string; alt: string }>;
  autoplayDelay?: number;
}

export default function VignetteCarousel({
  images,
  autoplayDelay = 3500,
}: VignetteCarouselProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}
      loop={images.length > 1}
      autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
      pagination={{ clickable: false }}
      className="h-full w-full"
      style={
        {
          // Surcharges Swiper : bullets primary Stitch, taille discrète.
          "--swiper-pagination-color": "#26445d",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.55",
          "--swiper-pagination-bullet-size": "6px",
          "--swiper-pagination-bullet-horizontal-gap": "3px",
          "--swiper-pagination-bottom": "8px",
        } as React.CSSProperties
      }
    >
      {images.map((img, index) => (
        <SwiperSlide key={index} className="flex h-full items-center justify-center">
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
