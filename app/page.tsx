"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./assets/main.css";
import { getApiUrl } from "./utils/getApiUrl"; // 🔥 Import de l'URL dynamique

async function getHomepageData() {
  const apiUrl = getApiUrl(); // 🔥 Utilisation de l'URL centralisée
  try {
    const response = await fetch(`${apiUrl}/api/homepages?populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch homepage content");
    }
    const data = await response.json();
    return data.data?.[0] ?? null;
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}

export default function HomePage() {
  const [homepage, setHomepage] = useState<any>(null);
  const apiUrl = getApiUrl();

  useEffect(() => {
    getHomepageData().then((data) => setHomepage(data));
  }, []);

  if (!homepage) return <p className="text-center text-blue-500">Chargement de la page...</p>;

  const title = homepage.title ?? "Titre par défaut";
  const cv = homepage.cv ?? "";
  const imageUrl = homepage.photo?.url ? `${apiUrl}${homepage.photo.url}` : null;

  return (
    <main className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center p-6 bg-white/55 rounded-lg mt-12 mb-3">
      <h1 className="text-3xl font-orbitron-24-bold-italic text-gray-800 mb-4">{title}</h1>

      {imageUrl ? (
        <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-3">
          <img src={imageUrl} alt="Photo de profil" className="w-full h-full object-cover object-center" />
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-gray-500 text-gray-200 rounded-full shadow-md">
          Image indisponible
        </div>
      )}

      <div className="mt-6 text-lg text-black-700 max-w-2xl font-orbitron-16-bold px-6 text-center">
        <ReactMarkdown>{cv}</ReactMarkdown>
      </div>
    </main>
  );
}
