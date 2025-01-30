import { useState, useEffect } from "react";
import CarouselCompetences from "./CarouselCompetences";

interface ModalGlossaireProps {
  glossaire: any[]; // Liste complète des mots-clés
}

export default function ModalGlossaire({ glossaire }: ModalGlossaireProps) {
  const [selectedMot, setSelectedMot] = useState<any | null>(null);

  useEffect(() => {
    // 🔥 Détecter si un mot-clé est dans l'URL (#glossaire-mot)
    function checkHash() {
      const hash = window.location.hash.replace("#glossaire-", "");
      const mot = glossaire.find((g) => g.mot_clef.toLowerCase() === hash.toLowerCase());
      setSelectedMot(mot || null);
    }

    window.addEventListener("hashchange", checkHash);
    checkHash(); // Vérifier au chargement

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, [glossaire]);

  if (!selectedMot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-3 right-3 text-gray-700 text-2xl"
          onClick={() => {
            setSelectedMot(null);
            window.location.hash = ""; // 🔄 Supprime le hash pour fermer la modale
          }}
        >
          ✖
        </button>

        {/* Titre */}
        <h2 className="text-2xl font-bold mb-4">{selectedMot.mot_clef}</h2>

        {/* Description */}
        <p className="text-gray-700 mb-4">{selectedMot.description}</p>

        {/* Carrousel d'images si disponible */}
        {selectedMot.images && selectedMot.images.length > 0 && (
          <CarouselCompetences
            images={selectedMot.images.map((img: any) => ({
              url: `http://localhost:1337${img?.formats?.large?.url || img?.url}`,
              alt: img.name || "Illustration",
            }))}
            className="w-full h-64"
          />
        )}
      </div>
    </div>
  );
}
