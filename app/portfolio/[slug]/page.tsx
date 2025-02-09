import ContentSection from "../../components/ContentSection";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  if (!slug) {
    return <div className="text-red-500 text-center">❌ Erreur : Slug introuvable.</div>;
  }

  return <ContentSection collection="projects" slug={slug} />;
}
