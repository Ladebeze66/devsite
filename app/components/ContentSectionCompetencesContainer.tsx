"use client"; // ✅ Indique que ce composant fonctionne côté client

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

  // ✅ États pour stocker les données récupérées
  const [competenceData, setCompetenceData] = useState(null);
  const [glossaireData, setGlossaireData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const competence = await fetchDataCompetences(collection, slug);
        console.log("✅ [ContentSectionCompetencesContainer] Données compétences :", competence);
        setCompetenceData(competence);

        const glossaire = await fetchDataGlossaire();
        console.log("✅ [ContentSectionCompetencesContainer] Données glossaire :", glossaire);
        setGlossaireData(glossaire);
      } catch (error) {
        console.error("❌ [ContentSectionCompetencesContainer] Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [collection, slug]); // ⚡ S'exécute à chaque changement de `collection` ou `slug`

  // ✅ Affichage d'un message de chargement
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
