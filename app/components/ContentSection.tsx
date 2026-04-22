"use client";

import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";
import { getApiUrl } from "../utils/getApiUrl";
import Carousel from "./Carousel";
import ReactMarkdown from "react-markdown";

interface ImageData {
  url: string;
  formats?: {
    large?: {
      url: string;
    };
  };
  name?: string;
}

interface ContentData {
  name: string;
  Resum: string;
  picture?: ImageData[];
  link?: string;
  linkText?: string;
}

interface ContentSectionProps {
  collection: string;
  slug: string;
  titleClass?: string;
  contentClass?: string;
}

export default function ContentSection({ collection, slug, titleClass, contentClass }: ContentSectionProps) {
  const [data, setData] = useState<ContentData | null>(null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchContent() {
        const result = await fetchData(collection, slug);
      setData(result);
    }

    fetchContent();
  }, [collection, slug, apiUrl]);

  if (!data) {
    return <div className="text-center text-gray-500">Contenu introuvable.</div>;
  }

  const { name, Resum: richText, picture, link, linkText } = data;

  const images = picture?.map((img: ImageData) => ({
    url: `${apiUrl}${img.formats?.large?.url || img.url}`,
    alt: img.name || "Image",
  })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className={titleClass || "bg-white/50 rounded-md text-3xl mb-6 font-headline font-extrabold tracking-tight p-2 text-blue-700"}>{name}</h1>

      <Carousel images={images} className="w-full h-64" />

      <div className={contentClass || "bg-white/80 rounded-md p-4 font-headline font-bold shadow-md mt-6"}>
        <ReactMarkdown>{richText}</ReactMarkdown>
      </div>

      {link && (
        <div className="mt-6">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/65 rounded-md p-1 text-red-700 hover:underline transition duration-300 ease-in-out transform hover:scale-105 font-headline font-bold hover:text-blue-700"
          >
            {linkText || "Voir plus/lien externe"}
          </a>
        </div>
      )}
    </div>
  );
}
