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

/**
 * Orchestre le fetch compétence + glossaire et transmet les données au rendu.
 * Le rendu (`ContentSectionCompetences`) gère son propre état "non trouvé" en
 * feuillet vellum — on s'aligne ici sur le même gabarit pour l'état de
 * chargement (étape 7.c).
 */
export default function ContentSectionCompetencesContainer({
  collection,
  slug,
}: ContentSectionProps) {
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
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-10 sm:px-6">
        <div className="rounded-sheet bg-surface-container-lowest/65 p-6 shadow-ambient-sm backdrop-blur-vellum">
          <div className="h-4 w-24 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-3 h-8 w-3/4 animate-pulse rounded-full bg-surface-container-low/80" />
          <div className="mt-5 aspect-[16/9] w-full animate-pulse rounded-tile bg-surface-container-low/80" />
          <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-surface-container-low/60" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-surface-container-low/60" />
          <div className="mt-2 h-4 w-4/6 animate-pulse rounded-full bg-surface-container-low/60" />
        </div>
      </div>
    );
  }

  return (
    <ContentSectionCompetences
      competenceData={competenceData}
      glossaireData={glossaireData}
    />
  );
}
