import { fetchData } from "../utils/fetchData";
import Carousel from "./Carousel";
import ReactMarkdown from "react-markdown";

interface ContentSectionProps {
  collection: string; // Nom de la collection (projects, events, blog, etc.)
  slug: string;
  titleClass?: string; // Permet de modifier le style du titre
  contentClass?: string; // Permet de modifier le style du contenu
}

export default async function ContentSection({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  const data = await fetchData(collection, slug);

  if (!data) {
    return <div>Contenu introuvable.</div>;
  }

  const { name, Resum: richText, picture, link, linkText } = data;

  // Transformer les images de Strapi en format attendu par le carrousel
  const images = picture?.map((img: any) => ({
    url: `http://localhost:1337${img?.formats?.large?.url || img?.url}`,
    alt: img.name || "Image",
  })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className={titleClass || "text-3xl mb-6 font-bold text-gray-700"}>{name}</h1>

      {/* Carrousel réutilisable */}
      <Carousel images={images} className="w-full h-64" />

      {/* Contenu en Markdown */}
      <div className={contentClass || "bg-gray-100 rounded-md p-4 shadow-md mt-6"}>
        <ReactMarkdown>{richText}</ReactMarkdown>
      </div>

      {/* Lien externe */}
      {link && (
        <div className="mt-6">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-700"
          >
            {linkText || "Voir plus/lien externe"}
          </a>
        </div>
      )}
    </div>
  );
}