import ContentSection from "../../components/ContentSection";

export default function Page({ params }: { params: { slug: string } }) {
  return <ContentSection collection="projects" slug={params.slug} />;
}
