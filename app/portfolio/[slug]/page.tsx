import ContentSection from "../../components/ContentSection"; // Importation du composant ContentSection

// Composant principal de la page de détail du projet
export default function Page({ params }: { params: { slug: string } }) {
  // Rendu du composant ContentSection avec les paramètres de la collection et du slug
  return <ContentSection collection="projects" slug={params.slug} />;
}