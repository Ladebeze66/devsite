import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

export default function CompetencePage({ params }: { params: { slug: string } }) {
  // Vérifie que le paramètre `slug` est bien défini
  if (!params?.slug) {
    return <div>Erreur : Slug introuvable.</div>;
  }

  return <ContentSectionCompetencesContainer collection="competences" slug={params.slug} />;
}
