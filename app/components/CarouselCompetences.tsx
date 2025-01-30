"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarouselProps {
  images: Array<{ url: string; alt: string }>;
  className?: string;
}

export default function CarouselCompetences({ images, className }: CarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Carrousel compétences */}
      <div className={`relative w-full ${className || "h-64"} rounded-md shadow-md`}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className={`w-full ${className || "h-64"}`}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center h-full">
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage(img.url)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal plein écran pour agrandir les images */}
      {selectedImage &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-10 backdrop-blur-2xl transition-opacity duration-300 z-[1000]"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-6xl p-6 bg-transparent">
              <button
                className="absolute top-6 right-6 text-white text-3xl bg-gray-900/70 p-2 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                ✖
              </button>
              <img
                src={selectedImage}
                alt="Agrandissement"
                className="w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
