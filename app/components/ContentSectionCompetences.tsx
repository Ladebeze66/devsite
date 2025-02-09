"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../utils/getApiUrl"; // ✅ Importation de l'URL dynamique
import CarouselCompetences from "./CarouselCompetences";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ModalGlossaire from "./ModalGlossaire";

// ✅ Définition des types pour TypeScript
interface ImageData {
  url: string;
  formats?: {
    large?: { url: string };
  };
  name?: string;
}

interface CompetenceData {
  name: string;
  content: string;
  picture?: ImageData[];
}

interface GlossaireItem {
  mot_clef: string;
  slug: string;
  variantes: string[];
  description: string;
  images?: ImageData[];
}

interface ContentSectionProps {
  competenceData: CompetenceData | null;
  glossaireData: GlossaireItem[];
  titleClass?: string;
  contentClass?: string;
}

// ✅ Composant principal
export default function ContentSectionCompetences({ competenceData, glossaireData, titleClass, contentClass }: ContentSectionProps) {
  console.log("🔍 [ContentSectionCompetences] Chargement du composant...");
  console.log("📌 [ContentSectionCompetences] Données reçues - competenceData :", competenceData);
  console.log("📌 [ContentSectionCompetences] Données reçues - glossaireData :", glossaireData);

  const [selectedMot, setSelectedMot] = useState<GlossaireItem | null>(null);
  const apiUrl = getApiUrl(); // ✅ Détection automatique de l'URL API

  if (!competenceData) {
    console.error("❌ [ContentSectionCompetences] Compétence introuvable !");
    return <div className="text-red-500 text-center">❌ Compétence introuvable.</div>;
  }

  // ✅ Déstructuration des données de la compétence
  const { name, content, picture } = competenceData;

  // ✅ Transformation des images de Strapi en format attendu par le carrousel
  const images = picture?.map((img) => ({
    url: `${apiUrl}${img.formats?.large?.url || img.url}`, // ✅ Correction ici
    alt: img.name || "Image de compétence",
  })) || [];

  console.log("✅ [ContentSectionCompetences] Images préparées :", images);

  // ✅ Transformation des mots-clés du glossaire
  function transformMarkdownWithKeywords(text: string) {
    if (!glossaireData.length) return text;

    let modifiedText = text;
    glossaireData.forEach(({ mot_clef, variantes }) => {
      const regexVariants = variantes.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      const regex = new RegExp(`\\b(${mot_clef}|${regexVariants})\\b`, "gi");

      modifiedText = modifiedText.replace(regex, (match) => {
        return `<span class="keyword" data-mot="${mot_clef}" style="color: blue; cursor: pointer;">${match}</span>`;
      });
    });

    console.log("🔄 [ContentSectionCompetences] Contenu transformé avec mots-clés :", modifiedText);
    return modifiedText;
  }

  const contentWithLinks = transformMarkdownWithKeywords(content);

  // ✅ Gestion des clics sur les mots-clés
  useEffect(() => {
    function handleKeywordClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.classList.contains("keyword")) {
        const mot = target.getAttribute("data-mot");
        if (mot) {
          const glossaireMot = glossaireData.find((g) => g.mot_clef === mot);
          setSelectedMot(glossaireMot || null);
        }
      }
    }

    document.body.addEventListener("click", handleKeywordClick);
    return () => document.body.removeEventListener("click", handleKeywordClick);
  }, [glossaireData]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ✅ Ajout de logs visuels dans le rendu */}
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>
      <CarouselCompetences images={images} className="w-full h-64" />
      <div className={contentClass || "mt-6 text-lg text-black-700"}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{contentWithLinks}</ReactMarkdown>
      </div>
      {selectedMot && <ModalGlossaire mot={selectedMot} onClose={() => setSelectedMot(null)} />}
    </div>
  );
}
