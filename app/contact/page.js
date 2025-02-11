// Importation de ContactForm et getApiUrl
import ContactForm from "../components/ContactForm";
import { getApiUrl } from "../utils/getApiUrl";

export default function ContactPage() {
  // Définition de l'URL API dynamique
  const apiUrl = getApiUrl();

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Titre avec un cadre */}
      <h1 className="bg-white/50 rounded-md text-3xl font-orbitron-24-bold text-center mb-6 border-b-4 border-blue-500 pb-2">
        📬 Correspondance
      </h1>

      {/* Texte d'introduction */}
      <p className="bg-white/70 rounded-md font-orbitron-16 text-lg text-center border-b-4 border-blue-500 pb-2 mb-4">
        Vous pouvez me contacter via ce formulaire ou sur mes réseaux sociaux.
      </p>

      {/* Informations de contact mises à jour */}
      <div className="bg-white/80 rounded-md flex flex-col items-center space-y-4 mb-6">
        <p className="text-blue-500 font-orbitron-16-bold">
          LinkedIn: Fernand Gras-Calvet
        </p>
        <p className="text-blue-500 font-orbitron-16-bold">
          Facebook: Fernand Gras-Calvet
        </p>
        <p className="text-blue-500 font-orbitron-16-bold">
          Email: grascalvet.fernand@gmail.com
        </p>
      </div>

      {/* Formulaire de contact amélioré */}
      <div className="bg-white/50 p-6 rounded-lg border-b-4 border-blue-500 pb-2 shadow">
        <ContactForm apiUrl={apiUrl} />
      </div>
    </div>
  );
}