import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

export default function CompetencePage({ params }: { params: { slug: string } }) {
  return <ContentSectionCompetencesContainer collection="competences" slug={params.slug} />;
}
