import { fetchData } from "../utils/fetchData"; // Importation de la fonction fetchData pour récupérer les données depuis l'API
import Carousel from "./Carousel"; // Importation du composant Carousel pour afficher les images
import ReactMarkdown from "react-markdown"; // Importation de ReactMarkdown pour rendre le texte riche en Markdown

// Définition des propriétés du composant ContentSection
interface ContentSectionProps {
  collection: string; // Nom de la collection (projects, events, blog, etc.)
  slug: string; // Identifiant unique pour récupérer les données spécifiques
  titleClass?: string; // Permet de modifier le style du titre
  contentClass?: string; // Permet de modifier le style du contenu
}

// Composant principal ContentSection
export default async function ContentSection({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  // Récupération des données depuis l'API en utilisant la fonction fetchData
  const data = await fetchData(collection, slug);

  // Affichage d'un message si les données ne sont pas disponibles
  if (!data) {
    return <div>Contenu introuvable.</div>;
  }

  // Déstructuration des données récupérées
  const { name, Resum: richText, picture, link, linkText } = data;

  // Transformation des images de Strapi en format attendu par le carrousel
  const images = picture?.map((img: any) => ({
    url: `http://localhost:1337${img?.formats?.large?.url || img?.url}`, // Utilisation de l'URL de l'image en format large ou originale
    alt: img.name || "Image", // Texte alternatif pour l'image
  })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Titre de la section */}
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>

      {/* Carrousel réutilisable pour afficher les images */}
      <Carousel images={images} className="w-full h-64" />

      {/* Contenu en Markdown */}
      <div className={contentClass || "bg-gray-100 rounded-md p-4 shadow-md mt-6"}>
        <ReactMarkdown>{richText}</ReactMarkdown>
      </div>

      {/* Lien externe */}
      {link && (
        <div className="mt-6">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-700"
          >
            {linkText || "Voir plus/lien externe"}
          </a>
        </div>
      )}
    </div>
  );
}