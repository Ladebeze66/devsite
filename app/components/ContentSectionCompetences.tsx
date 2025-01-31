"use client";

import { useState, useEffect } from "react";
import CarouselCompetences from "./CarouselCompetences";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // ✅ Permet d'interpréter le HTML dans ReactMarkdown
import ModalGlossaire from "./ModalGlossaire";

// Définition des propriétés du composant ContentSectionCompetences
interface ContentSectionProps {
  competenceData: any;
  glossaireData: any[];
  titleClass?: string;
  contentClass?: string;
}

// ✅ Définition du type Glossaire
interface GlossaireItem {
  mot_clef: string;
  slug: string;
  variantes: string[];
  description: string;
  images?: any[];
}

// Composant principal ContentSectionCompetences
export default function ContentSectionCompetences({ competenceData, glossaireData, titleClass, contentClass }: ContentSectionProps) {
  const [selectedMot, setSelectedMot] = useState<GlossaireItem | null>(null);

  if (!competenceData) {
    return <div className="text-red-500 text-center">❌ Compétence introuvable.</div>;
  }

  // Déstructuration des données de la compétence
  const { name, content, picture } = competenceData;

  // Transformation des images de Strapi en format attendu par le carrousel
  const images = picture?.map((img: any) => ({
    url: `http://localhost:1337${img?.formats?.large?.url || img?.url}`,
    alt: img.name || "Image de compétence",
  })) || [];

  // 🔥 Transformation du texte riche avec des <span> cliquables
  function transformMarkdownWithKeywords(text: string) {
    if (!glossaireData || glossaireData.length === 0) return text;

    let modifiedText = text;

    glossaireData.forEach(({ mot_clef, variantes }) => {
      const regexVariants = (variantes || []).map((v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      const regex = new RegExp(`\\b(${mot_clef}|${regexVariants})\\b`, "gi");

      modifiedText = modifiedText.replace(regex, (match) => {
        return `<span class="keyword" data-mot="${mot_clef}" style="color: blue; cursor: pointer;">${match}</span>`; // ✅ Span cliquable
      });
    });

    return modifiedText;
  }

  const contentWithLinks = transformMarkdownWithKeywords(content);

  // ✅ Gestion des clics sur les mots-clés
  useEffect(() => {
    function handleKeywordClick(event: any) {
      const target = event.target as HTMLElement;
      if (target.classList.contains("keyword")) {
        const mot = target.getAttribute("data-mot");
        if (mot) {
          const glossaireMot = glossaireData.find((g) => g.mot_clef === mot);
          setSelectedMot(glossaireMot || null);
        }
      }
    }

    document.addEventListener("click", handleKeywordClick);
    return () => document.removeEventListener("click", handleKeywordClick);
  }, [glossaireData]);

  return (
    // ✅ Affichage de la compétence
    <div className="max-w-3xl mx-auto p-6">
      {/* Titre de la section */}
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>

      {/* Carrousel pour afficher les images */}
      <CarouselCompetences images={images} className="w-full h-64" />

      {/* 🔥 Affichage du texte riche avec mots-clés cliquables */}
      <div className={contentClass || "mt-6 text-lg text-black-700"}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{contentWithLinks}</ReactMarkdown> {/* ✅ Permet d'interpréter le HTML */}
      </div>

      {/* 🚀 Modale pour afficher les infos des mots-clés */}
      {selectedMot && <ModalGlossaire mot={selectedMot} onClose={() => setSelectedMot(null)} />}
    </div>
  );
}
