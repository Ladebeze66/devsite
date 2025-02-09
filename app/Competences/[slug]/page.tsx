"use client"; // ✅ Indique que ce composant fonctionne côté client

import { useParams } from "next/navigation"; // ✅ Nouvelle méthode pour récupérer `params`
import { useEffect, useState } from "react";
import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

export default function CompetencePage() {
  const params = useParams(); // ✅ Récupérer `params` correctement
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      setSlug(params.slug as string); // ✅ Assurer que `slug` est bien une string
    }
  }, [params]);

  if (!slug) {
    return <div className="text-center text-gray-500">⏳ Chargement...</div>;
  }

  return <ContentSectionCompetencesContainer collection="competences" slug={slug} />;
}
