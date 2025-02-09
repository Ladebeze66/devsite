import ContentSectionCompetencesContainer from "../../components/ContentSectionCompetencesContainer";

export default function CompetencePage({ params }: { params: { slug?: string } }) {
  // ✅ Vérification du slug avant d'afficher le composant
  if (!params?.slug) {
    console.error("❌ [CompetencePage] Erreur : Aucun slug fourni !");
    return <div className="text-center text-red-500">❌ Erreur : Compétence introuvable.</div>;
  }

  return <ContentSectionCompetencesContainer collection="competences" slug={params.slug} />;
}
