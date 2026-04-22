"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../utils/getApiUrl";
import CarouselCompetences from "./CarouselCompetences";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ModalGlossaire from "./ModalGlossaire";
import ChatBot from "./ChatBot";

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [loading, setLoading] = useState(competenceData === null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (competenceData) {
      setLoading(false);
    }
  }, [competenceData]);

  if (loading) {
    return <div className="text-center text-gray-500">⏳ Chargement des détails de la compétence...</div>;
  }

  if (!competenceData) {
    console.error("❌ [ContentSectionCompetences] Compétence introuvable !");
    return <div className="text-red-500 text-center">❌ Compétence introuvable.</div>;
  }

  const { name, content, picture } = competenceData;

  const images =
    picture?.map((img) => ({
      url: `${apiUrl}${img.formats?.large?.url || img.url}`,
      alt: img.name || "Image de compétence",
    })) || [];

  function transformMarkdownWithKeywords(text: string) {
    if (!glossaireData.length) return text;

    let modifiedText = text;

    modifiedText = modifiedText.replace(
      /\bIA locale\b/g,
      `<span class="chatbot-keyword" data-chatbot="true" style="color: red; cursor: pointer;">IA locale</span>`
    );

    glossaireData.forEach(({ mot_clef, variantes }) => {
      const regexVariants = variantes
        .map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
      const regex = new RegExp(`\\b(${mot_clef}|${regexVariants})\\b`, "gi");

      modifiedText = modifiedText.replace(regex, (match) => {
        return `<span class="keyword" data-mot="${mot_clef}" style="color: blue; cursor: pointer;">${match}</span>`;
      });
    });

    return modifiedText;
  }

  const contentWithLinks = transformMarkdownWithKeywords(content);

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

  useEffect(() => {
    function handleChatbotClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.dataset.chatbot === "true") {
        setIsChatbotOpen(true);
      }
    }

    document.body.addEventListener("click", handleChatbotClick);
    return () => document.body.removeEventListener("click", handleChatbotClick);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className={titleClass || "bg-white/60 rounded-md p-1 text-2xl mb-6 font-headline font-bold text-blue-700"}>
        {name}
      </h1>
      <CarouselCompetences images={images} className="w-full h-64" />
      <div className={contentClass || "bg-white/70 rounded-md p-4 mt-6 text-lg font-headline font-bold text-black-700"}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{contentWithLinks}</ReactMarkdown>
      </div>
      {selectedMot && <ModalGlossaire mot={selectedMot} onClose={() => setSelectedMot(null)} />}

      {isChatbotOpen && (
        <div className="fixed bottom-10 right-10 p-4 w-96">
          <ChatBot onClose={() => setIsChatbotOpen(false)} />
        </div>
      )}
    </div>
  );
}
