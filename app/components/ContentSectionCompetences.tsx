import { fetchDataCompetences } from "../utils/fetchDataCompetences"; // ✅ Importation du bon fetch
import CarouselCompetences from "./CarouselCompetences";
import ReactMarkdown from "react-markdown";

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

export default async function ContentSectionCompetences({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  const data = await fetchDataCompetences(collection, slug); // ✅ Utilisation du fetch spécifique

  if (!data) {
    return <div className="text-red-500 text-center">❌ Compétence introuvable.</div>;
  }

  const { name, content, picture } = data; // ✅ Assure-toi que `content` est bien récupéré au lieu de `Resum`

  // 🔹 Transformation des images pour le carrousel des compétences
  const images = picture?.map((img: any) => ({
    url: `http://localhost:1337${img?.formats?.large?.url || img?.url}`,
    alt: img.name || "Image de compétence",
  })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>

      {/* Carrousel spécifique aux compétences */}
      <CarouselCompetences images={images} className="w-full h-64" />

      {/* Contenu en Markdown */}
      <div className={contentClass || "mt-6 text-lg text-black-700"}>
        <ReactMarkdown>{content}</ReactMarkdown> {/* ✅ Utilisation de `content` au lieu de `Resum` */}
      </div>
    </div>
  );
}
