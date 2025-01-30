import ContentSectionCompetences from "../../components/ContentSectionCompetences";

export default function Page({ params }: { params: { slug: string } }) {
  return <ContentSectionCompetences collection="competences" slug={params.slug} />;
}

