import CarouselCompetences from "./CarouselCompetences";

interface ModalGlossaireProps {
  mot: {
    mot_clef: string;
    description: string;
    images?: any[];
  };
  onClose: () => void;
}

export default function ModalGlossaire({ mot, onClose }: ModalGlossaireProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
        {/* Bouton de fermeture */}
        <button className="absolute top-3 right-3 text-gray-700 text-2xl" onClick={onClose}>
          ✖
        </button>

        {/* Titre */}
        <h2 className="text-2xl font-bold mb-4">{mot.mot_clef}</h2>

        {/* Description */}
        <p className="text-gray-700 mb-4">{mot.description}</p>

        {/* Carrousel d'images si disponible */}
        {mot.images && mot.images.length > 0 && (
          <CarouselCompetences
            images={mot.images.map((img: any) => ({
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
