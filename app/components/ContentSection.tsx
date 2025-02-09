"use client";

import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData"; // Importation de la fonction fetchData
import { getApiUrl } from "../utils/getApiUrl"; // Importation de l'URL dynamique
import Carousel from "./Carousel"; // Importation du composant Carrousel
import ReactMarkdown from "react-markdown"; // Importation pour gérer le Markdown

// Définition du type pour une image
interface ImageData {
  url: string;
  formats?: {
    large?: {
      url: string;
    };
  };
  name?: string;
}

// Définition du type pour les données récupérées
interface ContentData {
  name: string;
  Resum: string; // Texte en Markdown
  picture?: ImageData[];
  link?: string;
  linkText?: string;
}

// Définition des propriétés du composant ContentSection
interface ContentSectionProps {
  collection: string; // Nom de la collection (projects, events, blog, etc.)
  slug: string; // Identifiant unique pour récupérer les données spécifiques
  titleClass?: string; // Permet de modifier le style du titre
  contentClass?: string; // Permet de modifier le style du contenu
}

// Composant principal ContentSection
export default function ContentSection({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  const [data, setData] = useState<ContentData | null>(null);
  const apiUrl = getApiUrl(); // Détection automatique de l'URL de l'API

  useEffect(() => {
    async function fetchContent() {
      console.log("🔍 API utilisée pour ContentSection :", apiUrl);
      const result = await fetchData(collection, slug);
      setData(result);
    }

    fetchContent();
  }, [collection, slug, apiUrl]);

  // Affichage d'un message si les données ne sont pas disponibles
  if (!data) {
    return <div className="text-center text-gray-500">Contenu introuvable.</div>;
  }

  // Déstructuration des données récupérées
  const { name, Resum: richText, picture, link, linkText } = data;

  // Transformation des images de Strapi en format attendu par le carrousel
  const images = picture?.map((img: ImageData) => ({
    url: `${apiUrl}${img.formats?.large?.url || img.url}`, // 🔥 URL dynamique
    alt: img.name || "Image", // Texte alternatif pour l'image
  })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Titre de la section */}
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>

      {/* Carrousel réutilisable pour afficher les images */}
      <Carousel images={images} className="w-full h-64" />

      {/* Contenu en Markdown */}
      <div className={contentClass || "bg-white/55 rounded-md p-4 shadow-md mt-6"}>
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
