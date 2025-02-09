"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../utils/getApiUrl"; // 🔥 Import de l'URL dynamique

export default function Page() {
  const [competences, setCompetences] = useState([]); // 🔥 Stocker les compétences une seule fois
  const apiUrl = getApiUrl(); // 🔥 Définition de l'URL API

  useEffect(() => {
    async function fetchCompetences() {
      console.log("🔍 API utilisée pour les compétences :", apiUrl);
      try {
        const response = await fetch(`${apiUrl}/api/competences?populate=*`);
        if (!response.ok) {
          throw new Error(`Erreur de récupération des compétences : ${response.statusText}`);
        }
        const data = await response.json();
        setCompetences(data.data ?? []);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des compétences :", error);
      }
    }

    fetchCompetences(); // 🔥 Exécuter une seule fois au montage du composant
  }, [apiUrl]); // ✅ Exécuter `useEffect()` uniquement si `apiUrl` change

  return (
    <main className="w-full p-3 mt-5 mb-5">
      {/* Titre de la page */}
      <h1 className="text-3xl mb-3 font-bold text-gray-700 text-center">Mes Compétences</h1>

      {/* Affichage d'un message si aucune compétence n'est trouvée */}
      {competences.length === 0 ? (
        <p className="text-center text-gray-500">Aucune compétence disponible.</p>
      ) : (
        <div className="grid gap-7 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
          {competences.map((competence) => {
            const picture = competence.picture?.[0];
            const imageUrl = picture?.url ? `${apiUrl}${picture.url}` : "/placeholder.jpg";

            return (
              <div
                key={competence.id}
                className="bg-white rounded-lg shadow-md overflow-hidden w-80 h-96 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-4"
              >
                {/* Lien vers la page de détail de la compétence */}
                <Link href={`/competences/${competence.slug}`}>
                  <div className="overflow-hidden w-full h-48 mb-4">
                    <img
                      src={imageUrl}
                      alt={picture?.name || "Competence image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow overflow-y-auto max-h-32 hide-scrollbar show-scrollbar">
                    <p className="font-bold text-xl mb-2">{competence.name}</p>
                    <p className="text-gray-700 text-sm hover:text-base transition-all duration-200 ease-in-out">
                      {competence.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
