import { fetchDataCompetences, fetchDataGlossaire } from "../utils/fetchDataCompetences";
import ContentSectionCompetences from "./ContentSectionCompetences";

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

export default async function ContentSectionCompetencesContainer({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  console.log("🔍 [ContentSectionCompetencesContainer] Chargement des données...");
  
  const competenceData = await fetchDataCompetences(collection, slug);
  console.log("✅ [ContentSectionCompetencesContainer] Données compétences :", JSON.stringify(competenceData, null, 2));

  const glossaireData = await fetchDataGlossaire();
  console.log("✅ [ContentSectionCompetencesContainer] Données glossaire :", JSON.stringify(glossaireData, null, 2));

  return (
    <ContentSectionCompetences
      competenceData={competenceData}
      glossaireData={glossaireData}
      titleClass={titleClass}
      contentClass={contentClass}
    />
  );
}
