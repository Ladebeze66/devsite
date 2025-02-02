import React from "react";
import ReactMarkdown from "react-markdown"; // Importation de ReactMarkdown
import "./assets/main.css";

async function getHomepageData() {
  try {
    const response = await fetch("http://localhost:1337/api/homepages?populate=*");
    if (!response.ok) {
      throw new Error("Failed to fetch homepage content");
    }
    const homepage = await response.json();
    return homepage.data?.[0]; // On récupère la première entrée
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}

export default async function HomePage() {
  const homepage = await getHomepageData();
  if (!homepage) return <p className="text-center text-red-500">Erreur lors du chargement du contenu.</p>;

  // Récupération des données
  const title = homepage?.title;
  const cv = homepage?.cv || ""; // Assurer que `cv` est une chaîne même si vide
  const photo = homepage?.photo;

  // Correction de l'URL de l'image
  const baseUrl = "http://localhost:1337";
  const imageUrl = photo?.url ? `${baseUrl}${photo.url}` : null;

  return (
    <main className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center p-6 bg-white/30 rounded-lg mt-3 mb-3">
      {/* Texte court (title) */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

      {/* Photo en cadre ovale avec effet hover */}
      {imageUrl ? (
        <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-gray-300 transition-transform duration-300 hover:scale-110 hover:rotate-3">
          <img src={imageUrl} alt="Photo de profil" className="w-full h-full object-cover object-center" />
        </div>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-gray-500 text-gray-200 rounded-full shadow-md">
          Image indisponible
        </div>
      )}

      {/* Texte riche en Markdown */}
      <div className="mt-6 text-lg text-black-700 max-w-2xl px-6 text-center">
        <ReactMarkdown>{cv}</ReactMarkdown>
      </div>
    </main>
  );
}
