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
      <p className="bg-white/70  rounded-md font-orbitron-16 text-lg text-center border-b-4 border-blue-500 pb-2 mb-4">
        Vous pouvez me contacter via ce formulaire ou sur mes réseaux sociaux.
      </p>

      {/* Liens vers les réseaux sociaux mis à jour */}
      <div className="bg-white/80 rounded-mt flex justify-center space-x-4 mb-6">
        <a href="https://linkedin.com/in/votreprofil" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-blue-500 hover:text-blue-700 font-orbitron-16-bold transition">
          LinkedIn
        </a>
        <a href="https://www.facebook.com/ton.profil" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-blue-500 hover:text-blue-700 font-orbitron-16-bold transition">
          Facebook
        </a>
        <a href="mailto:grascalvet.fernand@gmail.com" 
           className="text-blue-500 hover:text-blue-700 font-orbitron-16-bold transition">
          Email
        </a>
      </div>

      {/* Formulaire de contact amélioré */}
      <div className="bg-white/50 p-6 rounded-lg border-b-4 border-blue-500 pb-2 shadow">
        <ContactForm apiUrl={apiUrl} />
      </div>
    </div>
  );
}
