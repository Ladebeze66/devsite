import ContentSectionCompetences from "../../components/ContentSectionCompetences";

export default function Page({ params }: { params: { slug: string } }) {
  console.log("🛠️ Paramètres reçus :", params.slug);
  return <ContentSectionCompetences collection="competences" slug={params.slug} />;
}
