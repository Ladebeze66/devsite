"use client";

import { useEffect, useState } from "react";
import { fetchDataCompetences, fetchDataGlossaire } from "../utils/fetchDataCompetences";
import ContentSectionCompetences from "./ContentSectionCompetences";

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

export default function ContentSectionCompetencesContainer({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  console.log("🔍 [ContentSectionCompetencesContainer] Chargement des données...");

  const [competenceData, setCompetenceData] = useState(null);
  const [glossaireData, setGlossaireData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const competence = await fetchDataCompetences(collection, slug);
        setCompetenceData(competence);

        const glossaire = await fetchDataGlossaire();
        setGlossaireData(glossaire);
      } catch (error) {
        console.error("❌ [ContentSectionCompetencesContainer] Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [collection, slug]);

  if (loading) {
    return <div className="text-center text-gray-500">⏳ Chargement des compétences...</div>;
  }

  return (
    <ContentSectionCompetences
      competenceData={competenceData}
      glossaireData={glossaireData}
      titleClass={titleClass}
      contentClass={contentClass}
    />
  );
}
