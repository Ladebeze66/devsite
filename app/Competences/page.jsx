"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "../utils/getApiUrl";
import CarouselCompetences from "../components/CarouselCompetences";
import "../globals.css";
import "../assets/main.css";

export default function Page() {
  const [competences, setCompetences] = useState([]);
  const apiUrl = getApiUrl();

  useEffect(() => {
    async function fetchCompetences() {
      try {
        const response = await fetch(`${apiUrl}/api/competences?populate=*`);
        if (!response.ok) {
          throw new Error(`Erreur de récupération des compétences : ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Tri sécurisé des compétences par `order`
        const sortedCompetences = (data.data ?? []).sort((a, b) => ((a.attributes?.order ?? 999) - (b.attributes?.order ?? 999)));
  
        setCompetences(sortedCompetences);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des compétences :", error);
      }
    }
  
    fetchCompetences();
  }, [apiUrl]);
  
  
  

  return (
    <main className="w-full p-3 mt-5 mb-5">

      
      {competences.length === 0 ? (
        <p className="text-center text-gray-500">Aucune compétence disponible.</p>
      ) : (
        <div className="flex flex-col gap-7 max-w-7xl mx-auto">
          {competences.map((competence) => {
            const pictures = competence.picture || [];
            const images = pictures.map(picture => ({
              url: picture.url ? `${apiUrl}${picture.url}` : "/placeholder.jpg",
              alt: picture.name || "Competence image"
            }));

            return (
              <div
  key={competence.id}
  className="bg-white/70 rounded-lg shadow-md overflow-hidden w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-4"
>
  <Link href={`/competences/${competence.slug}`}>
    <div className="overflow-hidden w-full h-64 mb-4">
      <CarouselCompetences images={images} className="w-full h-full object-cover" />
    </div>
    <div className="flex-grow overflow-y-auto max-h-32 hide-scrollbar show-scrollbar">
      <p className="font-headline font-bold text-xl mb-2">{competence.name}</p>
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