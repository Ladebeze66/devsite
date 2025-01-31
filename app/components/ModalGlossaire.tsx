import { useEffect } from "react";
import { createPortal } from "react-dom"; // Insère la modale dans <body>
import CarouselCompetences from "./CarouselCompetences"; // Importation du composant CarouselCompetences pour afficher les images

// Définition des propriétés du composant ModalGlossaire
interface ModalGlossaireProps {
  mot: {
    mot_clef: string; // Mot-clé du glossaire
    description: string; // Description du mot-clé
    images?: any[]; // Images associées au mot-clé
  };
  onClose: () => void; // Fonction pour fermer la modale
}

// Composant principal ModalGlossaire
export default function ModalGlossaire({ mot, onClose }: ModalGlossaireProps) {
  // Désactiver le scroll du `body` quand la modale est ouverte
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Debug : Vérifier les images reçues
  console.log("🖼️ Images reçues dans la modale :", mot.images);

  // Vérifier si `mot.images` est bien un tableau et contient des images
  const images = mot.images?.map((img: any) => {
    return {
      url: `http://localhost:1337${img.formats?.large?.url || img.url}`,
      alt: img.name || "Illustration",
    };
  }) || [];

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-75 flex items-center justify-center z-[1000]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-4xl relative">
        {/* Bouton de fermeture */}
        <button className="absolute top-3 right-3 text-gray-700 text-2xl" onClick={onClose}>
          ✖
        </button>

        {/* Titre */}
        <h2 className="text-3xl font-bold mb-4">{mot.mot_clef}</h2>

        {/* Description */}
        <p className="text-gray-700 mb-6">{mot.description}</p>

        {/* Carrousel d'images si disponible */}
        {images.length > 0 ? (
          <CarouselCompetences images={images} className="w-full h-80" />
        ) : (
          <p className="text-gray-500">Aucune image disponible.</p>
        )}
      </div>
    </div>,
    document.body
  );
}