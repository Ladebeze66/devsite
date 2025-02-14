"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

export default function CompetencePage() {
  const params = useParams();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug) {
      setSlug(params.slug as string);
    }
  }, [params]);

  if (!slug) {
    return <div className="text-center text-gray-500">⏳ Chargement...</div>;
  }

  return <ContentSectionCompetencesContainer collection="competences" slug={slug} />;
}
