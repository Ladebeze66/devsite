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

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const images = mot.images?.map((img) => ({
    url: `${apiUrl}${img.formats?.large?.url || img.url}`,
    alt: img.name || "Illustration",
  })) || [];

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-75 flex items-center justify-center z-[1000]">
      <div className="bg-white/60 p-6 rounded-lg shadow-lg w-[114vw] max-w-6xl relative h-[72vh]">
        <button className="absolute top-2 right-2 text-gray-700 text-sm p-1" onClick={onClose}>
          ✖
        </button>

        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Description */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-orbitron-16-bold mb-4">{mot.mot_clef}</h2>
            <p className="font-orbitron-12-bold text-gray-700 mb-6">{mot.description}</p>
          </div>

          <div className="md:w-1/2 h-full">
            {images.length > 0 ? (
              <CarouselCompetences images={images} className="w-full h-full" />
            ) : (
              <p className="text-gray-500">Aucune image disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}