"use client";

import { useState } from "react";
import { createPortal } from "react-dom"; // Importation de createPortal pour les modals
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarouselProps {
  images: Array<{ url: string; alt: string }>; // Propriétés des images du carrousel
  className?: string; // Classe CSS optionnelle pour personnaliser le style
}

export default function Carousel({ images, className }: CarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // État pour l'image sélectionnée

  return (
    <>
      {/* Carrousel principal */}
      <div className={`relative w-full ${className || "h-64"} rounded-md shadow-md`}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]} // Modules Swiper utilisés
          spaceBetween={10} // Espace entre les slides
          slidesPerView={1} // Nombre de slides visibles en même temps
          navigation // Activation de la navigation
          pagination={{ clickable: true }} // Activation de la pagination cliquable
          autoplay={{ delay: 3000 }} // Activation de l'autoplay avec un délai de 3 secondes
          className={`w-full ${className || "h-64"}`}
        >
          {/* Boucle sur les images pour les afficher dans le carrousel */}
          {images.map((img, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center h-full">
              {/* Image cliquable pour affichage en plein écran */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage(img.url)} // Ouvre l’image en plein écran
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal plein écran inséré dans <body> grâce à createPortal */}
      {selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-10 backdrop-blur-2xl transition-opacity duration-300 z-[1000]"
            onClick={() => setSelectedImage(null)} // Fermer au clic
          >
            <div className="relative w-full max-w-6xl p-6 bg-transparent">
              {/* Bouton de fermeture */}
              <button
                className="absolute top-6 right-6 text-white text-3xl bg-gray-900/70 p-2 rounded-full"
                onClick={() => setSelectedImage(null)} // Fermer au clic
              >
                ✖
              </button>

              {/* Image affichée en grand */}
              <img
                src={selectedImage}
                alt="Agrandissement"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}