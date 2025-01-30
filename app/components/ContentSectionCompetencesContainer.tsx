import { fetchDataCompetences, fetchDataGlossaire } from "../utils/fetchDataCompetences";
import ContentSectionCompetences from "./ContentSectionCompetences";

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

export default async function ContentSectionCompetencesContainer({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  const competenceData = await fetchDataCompetences(collection, slug);
  const glossaireData = await fetchDataGlossaire();

  return (
    <ContentSectionCompetences
      competenceData={competenceData}
      glossaireData={glossaireData}
      titleClass={titleClass}
      contentClass={contentClass}
    />
  );
}
