"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../utils/getApiUrl";
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

export default function ContentSectionCompetences({
  competenceData,
  glossaireData,
  titleClass,
  contentClass,
}: ContentSectionProps) {
  console.log("🔍 [ContentSectionCompetences] Chargement du composant...");

  const [selectedMot, setSelectedMot] = useState<GlossaireItem | null>(null);
  const [loading, setLoading] = useState(competenceData === null); // ✅ Initialiser correctement loading
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (competenceData) {
      setLoading(false); // ✅ Mise à jour de loading une seule fois après chargement
    }
  }, [competenceData]);

  // ✅ Affichage d'un message de chargement
  if (loading) {
    return <div className="text-center text-gray-500">⏳ Chargement des détails de la compétence...</div>;
  }

  if (!competenceData) {
    console.error("❌ [ContentSectionCompetences] Compétence introuvable !");
    return <div className="text-red-500 text-center">❌ Compétence introuvable.</div>;
  }

  const { name, content, picture } = competenceData;

  // ✅ Transformation des images de Strapi en format attendu par le carrousel
  const images =
    picture?.map((img) => ({
      url: `${apiUrl}${img.formats?.large?.url || img.url}`,
      alt: img.name || "Image de compétence",
    })) || [];

  console.log("✅ [ContentSectionCompetences] Images préparées :", images);

  // ✅ Transformation des mots-clés du glossaire
  function transformMarkdownWithKeywords(text: string) {
    if (!glossaireData.length) return text;

    let modifiedText = text;
    glossaireData.forEach(({ mot_clef, variantes }) => {
      const regexVariants = variantes
        .map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
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
      <h1 className={titleClass || "bg-white/60 rounded-md  p-1 text-2xl mb-6 font-orbitron-16-bold text-blue-700"}>{name}</h1>
      <CarouselCompetences images={images} className="w-full h-64" />
      <div className={contentClass || "bg-white/70 rounded-md p-4 mt-6 text-lg font-orbitron-16-bold text-black-700"}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{contentWithLinks}</ReactMarkdown>
      </div>
      {selectedMot && <ModalGlossaire mot={selectedMot} onClose={() => setSelectedMot(null)} />}
    </div>
  );
}
